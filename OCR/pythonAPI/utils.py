import numpy as np
import cv2
import os
import math
# import pyautogui as pag

# move here from analyzer
def convert_circled_numerals_to_arabic(text):
    circled_numeral_mapping = {
        '①': '1', '②': '2', '③': '3', '④': '4',
        '⑤': '5', '⑥': '6', '⑦': '7', '⑧': '8',
        '⑨': '9', '⑩': '10', '⑪': '11', '⑫': '12',
        '⑬': '13', '⑭': '14', '⑮': '15', '⑯': '16',
        '⑰': '17', '⑱': '18', '⑲': '19', '⑳': '20'
    }
    return ''.join(circled_numeral_mapping.get(char, char) for char in text)


def cropImage(img) : 
    # printimg("Original Image", img)
    if img.shape[1] > 900:
        img = cv2.resize(img, (int(img.shape[1] * 900 / img.shape[1]), int(img.shape[0] * 900 / img.shape[1])))
    if img.shape[0] > 900:
        img = cv2.resize(img, (int(img.shape[1] * 900 / img.shape[0]), int(img.shape[0] * 900 / img.shape[0])))
    progressimg1, edgeimg = getedge(img)  # エッジ画像まで作成(ノイズ除去、エッジ膨張済み)
    lineimg, linelist = getline(img, edgeimg)  # ハフ変換で直線検出
    reducelineimg, reduceline = cleanline(img, linelist)  # 直線の本数を減らす
    coordinate = getcoordinate(reduceline, edgeimg.shape)  # 候補となるオブジェクトをただ1つ取得した
    # print("coordinate=" + str(coordinate))
    ### FIXME # send to JS some flag value
    if len(coordinate) == 0:
        print("Cant detect whiteboard here, please manually choose the coordinate")
        numpyarray = level1(img)
        if len(numpyarray) is not []:
            newimg = image_processor(img, numpyarray)
            cv2.waitKey(0)
    else:
        croparea = showcroparea(img, coordinate)
        finalprogress1 = np.concatenate((img, lineimg), axis=1)
        finalprogress2 = np.concatenate((reducelineimg, croparea), axis=1)
        finalprogress = np.concatenate((finalprogress1, finalprogress2), axis=0)
        newimg = image_processor(img, coordinate[0])
        resizedImg = resize_image(newimg)
        contrastImg = adjust_brightness_contrast(resizedImg, 0.8)
        # grayImage = cv2.cvtColor(newimg, cv2.COLOR_BGR2GRAY)
        # (_, bwImage) =  cv2.threshold(grayImage, 128, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)
        
        # printimg("result", contrastImg)
        return contrastImg
    cv2.destroyAllWindows()

def resize_image(image):
    scale_factor = 4

    width = int(image.shape[1] * scale_factor)
    height = int(image.shape[0] * scale_factor)
    
    resized_image = cv2.resize(image, (width, height), interpolation=cv2.INTER_CUBIC)
    
    return resized_image

def adjust_brightness_contrast(image, alpha=1.0, beta=0):
    new_image = np.clip(alpha * image + beta, 0, 255)
    new_image = new_image.astype(np.uint8)
    return new_image


##### Papang's code from here

def getedge(img):
    newimg = img.copy()
    gray = cv2.cvtColor(newimg, cv2.COLOR_BGR2GRAY)
    # diameter of neighborhood / sigmacolor (the higer the more mixed)/ sigmaspace
    blur = cv2.bilateralFilter(gray, 7, 15, 50)
    edgeimg = canny(blur)  # ライブラリ関数ではなく自作関数

    cleanimg = getcleanimg(edgeimg)
    showimg = np.concatenate((blur, edgeimg), axis=1)  # 画像を横につなげる
    showimg = np.concatenate((showimg, cleanimg), axis=1)  # showing:グレー画像/canny画像/ノイズ除去、膨張画像
    return showimg, cleanimg


def canny(blur):
    med_val = np.median(blur)
    sigma = 0.33  # 0.33
    min_val = max(0, int(max(0, (1.0 - sigma) * med_val)) - 30)
    max_val = int(min(255, (1.0 + sigma) * med_val))
    edgeimg = cv2.Canny(blur, threshold1=min_val, threshold2=max_val)
    return edgeimg


def getcleanimg(edgeimg):
    kernel3 = np.ones((3, 3), np.uint8)
    # kernel5 = np.ones((5, 5), np.uint8)
    edgeimg1 = edgeimg.copy()
    edgeimg1 = cv2.dilate(edgeimg1, kernel3, iterations=1)  # cannyのエッジを膨張
    # get all connected components in the image with their stats (including their size, in pixel)
    nb_edges, output, stats, _ = cv2.connectedComponentsWithStats(edgeimg1, connectivity=8)
    # (stats[i, cv2.CC_STAT_AREA])
    # printimg("debug", edgeimg1)
    linesize = stats[1:, -1]  # 独立している白ピクセル領域の面積を格納
    # selecting bigger components
    cutimg = np.zeros_like(edgeimg)
    count = 0
    order = {}
    for e in range(0, nb_edges - 1):
        order[e] = linesize[e]  # 辞書にlinesizeを代入
    sorted_order = dict(sorted(order.items(), key=lambda item: item[1], reverse=True))
    for i in sorted_order.keys():  # 領域の大きなものから黒背景に追加,結果として輪郭ではないような面積の小さなノイズは除去される
        mask = cv2.inRange(output, i + 1, i + 1)
        cutimg = cutimg | mask
        # printimg("debug", cutimg)
        count += 1
        if count >= min(10, nb_edges / 5):
            break
    cutimg = cv2.dilate(cutimg, kernel3, iterations=1)
    return cutimg


def getline(pic, edgeimg):
    # flatten1 = np.nonzero(edgeimg.flatten())
    # nonzero = len(flatten1[0])
    min_length = int(min(edgeimg.shape[0], edgeimg.shape[1]) / 3)
    lines = cv2.HoughLinesP(edgeimg, rho=1, theta=np.pi / 360, threshold=100, minLineLength=min_length, maxLineGap=20)
    newpic = pic.copy()
    for line in lines:
        x1, y1, x2, y2 = line[0]
        # 赤線を引く
        newpic = cv2.line(newpic, (x1, y1), (x2, y2), (0, 0, 255), 1)
    lines = [x[0] for x in lines]
    for j, line in enumerate(lines):
        if lines[j][0] > lines[j][2]:
            temp = lines[j][0]
            lines[j][0] = lines[j][2]
            lines[j][2] = temp
            temp = lines[j][1]
            lines[j][1] = lines[j][3]
            lines[j][3] = temp
        if lines[j][0] == lines[j][2] and lines[j][1] > lines[j][3]:
            temp = lines[j][1]
            lines[j][1] = lines[j][3]
            lines[j][3] = temp
    return newpic, lines


def cleanline(pic, linelist):
    newline = []  # rho,theta,linelength,x1,y1,x2,y2
    # print("linelist size = %d" % (len(linelist)))
    # print(linelist)
    for j, line in enumerate(linelist):
        x1, y1, x2, y2 = line
        theta, rho = getmc(line)
        # print("XXXXX"+str(line)+"XXXX")
        # print("theta=%lf rho=%lf"%(theta,rho))
        exist = False
        for i in range(len(newline)):
            thetadif = abs(newline[i][0] - theta)
            if thetadif > math.pi:
                thetadif = thetadif - math.pi / 2
            rhodif = abs(newline[i][1] - rho)
            if thetadif < math.pi / 256 and rhodif < min(pic.shape[0], pic.shape[1]) / 30:
                # print("dif=%lf %lf" % (thetadif, rhodif))
                # print("same line with"+str(newline[i]))
                exist = True
                # if linelength(newline[i][3],newline[i][4],x2,y2)>newline[i][2]:
                #     newline[i][5]=x2
                #     newline[i][6]=y2
                # if linelength(x1,y1,newline[i][5],newline[i][6])>newline[i][2]:
                #     newline[i][3]=x1
                #     newline[i][4]=y1
                #
                s = [(newline[i][3], newline[i][4]), (newline[i][5], newline[i][6]), (x1, y1), (x2, y2)]
                s = sorted(s, key=lambda x: (x[0], x[1]))
                # print(s)
                newline[i][3] = s[0][0]
                newline[i][4] = s[0][1]
                newline[i][5] = s[3][0]
                newline[i][6] = s[3][1]
                newline[i][0], newline[i][1] = getmc([newline[i][3], newline[i][4], newline[i][5], newline[i][6]])
                newline[i][2] = linelength(newline[i][3], newline[i][4], newline[i][5], newline[i][6])
                # print("change to"+str(newline[i]))
                break
        if not exist:
            newline.append([theta, rho, linelength(x1, y1, x2, y2), x1, y1, x2, y2])
    # print("newline size = %d" % (len(newline)))
    newpic = pic.copy()
    lineresult = []
    for printline in newline:
        _, __, ___, x1, y1, x2, y2 = printline
        lineresult.append([x1, y1, x2, y2])
        # print("Print : %lf %lf %lf %lf"%(x1,y1,x2,y2))
        # 赤線を引く
        newpic = cv2.line(newpic, (x1, y1), (x2, y2), (255, 0, 255), 1)
    return newpic, newline


def getmc(pline):
    x1, y1, x2, y2 = pline
    if x2 - x1 == 0:
        return [math.atan(math.inf), x1]
    m = (float(y2) - y1) / (x2 - x1)
    theta = math.atan(m)
    rho = abs(y1 - m * x1) / math.sqrt(m * m + 1)
    return [theta, rho]


def linelength(x1, y1, x2, y2):
    return math.sqrt(pow(y2 - y1, 2) + pow(x2 - x1, 2))


def getcoordinate(lines, shape):
    results = []
    for p in range(len(lines)):
        result = []
        for q in range(len(lines)):
            # print("Between (%d %d) "%(p,q))
            result.append(line_cross_point(lines[p][3:], lines[q][3:], shape))
            # printline(img, lines[p], lines[q], str(p) + " " + str(q))
        results.append(result)
    coordinate = []
    for p in range(len(lines)):
        ptheta, prho = lines[p][:2]
        for q in range(p + 1, len(lines)):
            qtheta, qrho = lines[q][:2]
            rhodif1 = abs(prho - qrho)
            if not results[p][q] and rhodif1 > min(shape[0], shape[1]) / 3:
                for r in range(len(lines)):
                    rtheta, rrho = lines[r][:2]
                    # print("pass here1")
                    if results[p][r] and results[q][r]:
                        for s in range(r + 1, len(lines)):
                            stheta, srho = lines[s][:2]
                            rhodif2 = abs(rrho - srho)
                            # print("pass here2")
                            if results[p][s] and results[q][s]:
                                # print("pass here3")
                                # print("shape" + str(shape) + str((shape[0] * shape[1] / 5)))
                                # print("rhodif=%d %d" % (rhodif1, rhodif2))
                                if not results[r][s] and rhodif2 > min(shape[0], shape[1]) / 4:
                                    # print("pass here4")
                                    score = results[p][r][1] + results[q][r][1] + results[p][s][1] + results[q][s][1]
                                    point = np.array(
                                        [results[p][r][0], results[q][r][0], results[p][s][0], results[q][s][0]])
                                    point = order_points(point)
                                    if area(point) >= (shape[0] * shape[1] / 9) and middle(point, shape) is True:
                                        # print("p"+str(lines[p][3:]))
                                        # print("q" + str(lines[q][3:]))
                                        # print("r" + str(lines[r][3:]))
                                        # print("s" + str(lines[s][3:]))
                                        # print("point=" + str(point))
                                        # print("**saved**")
                                        # print("area %d" % (area(point)))
                                        # print("score"+str(score))
                                        # print("find at %d %d %d %d" % (p, q, r, s))
                                        # print("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
                                        # showcroparea(img, (0, 0, 0, lines[p], lines[q], lines[r], lines[s]))
                                        coordinate.append(
                                            (point, score, area(point), lines[p], lines[q], lines[r], lines[s]))
    # print("total found=%d"%len(coordinate))
    if len(coordinate) == 0:
        return []
    coordinate = sorted(coordinate, key=lambda x: (x[1]), reverse=True)
    maxscore = coordinate[0][1]
    coordinate = list(filter(lambda x: x[1] >= maxscore, coordinate))
    coordinate = sorted(coordinate, key=lambda x: (x[2]), reverse=True)
    return coordinate[0]


def line_cross_point(line_1, line_2, shape):  # 2つの線分と画像の大きさを入力
    x0, y0, x1, y1 = line_1
    x2, y2, x3, y3 = line_2
    a0 = x1 - x0
    b0 = y1 - y0
    a2 = x3 - x2
    b2 = y3 - y2
    d = a0 * b2 - a2 * b0
    if d == 0:
        # two lines are parallel
        return None
    # s = sn/d
    sn = b2 * (x2 - x0) - a2 * (y2 - y0)
    # t = tn/d
    # tn = b0 * (x2-x0) - a0 * (y2-y0)
    xans = x0 + a0 * sn / d
    yans = y0 + b0 * sn / d

    error = 0
    if ((yans + error >= y0 and yans <= y1 + error) or (yans + error >= y1 and yans <= y0 + error)) \
            and ((xans + error >= x0 and xans <= x1 + error) or (xans + error >= x1 and xans <= x0 + error)) \
            and ((yans + error >= y2 and yans <= y3 + error) or (yans + error >= y3 and yans <= y2 + error)) \
            and ((xans + error >= x2 and xans <= x3 + error) or (xans + error >= y3 and xans <= y2 + error)):
        return [xans, yans], 2

    error = min(shape[0], shape[1]) / 30
    if ((yans + error >= y0 and yans <= y1 + error) or (yans + error >= y1 and yans <= y0 + error)) \
            and ((xans + error >= x0 and xans <= x1 + error) or (xans + error >= x1 and xans <= x0 + error)) \
            and ((yans + error >= y2 and yans <= y3 + error) or (yans + error >= y3 and yans <= y2 + error)) \
            and ((xans + error >= x2 and xans <= x3 + error) or (xans + error >= y3 and xans <= y2 + error)):
        return [xans, yans], 1

    if 0 <= xans <= shape[1] and 0 <= yans <= shape[0]:
        return [xans, yans], 0

    return None


def order_points(pts):
    # initialize a list of coordinates that will be ordered
    # such that the first entry in the list is the top-left,
    # the second entry is the top-right, the third is the
    # bottom-right, and the fourth is the bottom-left
    pts = pts.reshape(4, 2)
    rect = np.zeros((4, 2), dtype="float32")
    # the top-left point will have the smallest sum, whereas
    # the bottom-right point will have the largest sum
    s = pts.sum(axis=1)
    rect[0] = pts[np.argmin(s)]
    rect[3] = pts[np.argmax(s)]
    # now, compute the difference between the points, the
    # top-right point will have the smallest difference,
    # whereas the bottom-left will have the largest difference
    diff = np.diff(pts, axis=1)
    rect[1] = pts[np.argmin(diff)]
    rect[2] = pts[np.argmax(diff)]
    # return the ordered coordinates
    return rect


def area(point):  # 四角形の面積を計算する
    sum1 = point[0][0] * point[1][1] + point[1][0] * point[3][1] + point[3][0] * point[2][1] + point[2][0] * point[0][1]
    sum2 = point[1][0] * point[0][1] + point[3][0] * point[1][1] + point[2][0] * point[3][1] + point[0][0] * point[2][1]
    area = abs(sum1 - sum2)
    return area / 2


def middle(point, shape):  # 各頂点がそれぞれ異なる象限に存在するか確かめる
    # check x-axis
    # print(point)
    # print(str(shape[1]/2)+" "+str(shape[0]/2))
    if point[0][0] < shape[1] / 2 and point[2][0] < shape[1] / 2:
        if point[1][0] > shape[1] / 2 and point[3][0] > shape[1] / 2:
            if point[0][1] < shape[0] / 2 and point[1][1] < shape[0] / 2:
                if point[2][1] > shape[0] / 2 and point[3][1] > shape[0] / 2:
                    return True
    return False


def showcroparea(img, coordinate):
    newpic = img.copy()
    x1, y1, x2, y2 = coordinate[3][3:]
    newpic = cv2.line(newpic, (x1, y1), (x2, y2), (0, 255, 255), 2)
    x1, y1, x2, y2 = coordinate[4][3:]
    newpic = cv2.line(newpic, (x1, y1), (x2, y2), (0, 0, 255), 2)
    x1, y1, x2, y2 = coordinate[5][3:]
    newpic = cv2.line(newpic, (x1, y1), (x2, y2), (0, 255, 0), 2)
    x1, y1, x2, y2 = coordinate[6][3:]
    newpic = cv2.line(newpic, (x1, y1), (x2, y2), (255, 0, 0), 2)
    return newpic


def image_processor(img, newcoordinate):  # 正対化
    width1 = math.sqrt(np.sum(np.power((newcoordinate[1] - newcoordinate[0]), 2)))
    width2 = math.sqrt(np.sum(np.power((newcoordinate[3] - newcoordinate[2]), 2)))
    height1 = math.sqrt(np.sum(np.power((newcoordinate[2] - newcoordinate[0]), 2)))
    height2 = math.sqrt(np.sum(np.power((newcoordinate[3] - newcoordinate[1]), 2)))
    height = (height1 + height2) / 2
    width = (width1 + width2) / 2
    oldcoordinate = np.float32([[0, 0], [width, 0], [0, height], [width, height]])
    oldimg = img.copy()
    for i in range(4):
        x, y = newcoordinate[i]
        cv2.circle(oldimg, (int(x), int(y)), 10, (0, 255, 0), -1)
    # 変換マトリクスと射影変換Z
    M = cv2.getPerspectiveTransform(newcoordinate, oldcoordinate)
    # print(M)
    newimg = cv2.warpPerspective(img, M, (int(width), int(height)))
    # Print results comparitively
    return newimg


arr = []


def draw_circle(event, x, y, flags, param):
    if event == cv2.EVENT_LBUTTONDOWN:
        cv2.circle(param, (x, y), 10, (0, 255, 0), -1)
        arr.append([x, y])


def level1(img):
    # image_processor(img,p_original[i])
    cv2.namedWindow(winname='Manual_Input_Required')
    drawn_img = img.copy()
    cv2.setMouseCallback('Manual_Input_Required', draw_circle, param=drawn_img)
    while True:
        cv2.imshow('Manual_Input_Required', drawn_img)
        if cv2.waitKey(20) & 0xFF == 27:
            break
        if len(arr) == 4:
            break
    cv2.destroyAllWindows()
    if len(arr) == 4:
        numpyarray = np.float32(arr)
        print(numpyarray)
        return numpyarray
    return []


# def printimg(word, img):
#     cv2.namedWindow(word)  # Create a named window
#     scr_w, scr_h = pag.size()
#     if word != "result":
#         cv2.moveWindow(word, int(scr_w * 0.1), int(scr_h * 0.1))
#     else:
#         cv2.moveWindow(word, 800, 500)
#     if img.shape[1] > scr_w:
#         img = cv2.resize(img, (int(img.shape[1]*scr_w/img.shape[1]), int(img.shape[0]*scr_w/img.shape[1])))
#     if img.shape[0] > scr_h:
#         img = cv2.resize(img, (int(img.shape[1] * scr_h / img.shape[0]), int(img.shape[0] * scr_h / img.shape[0])))
#     cv2.imshow(word, img)
#     cv2.waitKey(0)


# 有効化されているコードからの呼び出しはない
def printline(img, p, q, word):
    newpic = img.copy()
    x1, y1, x2, y2 = p
    # 赤線を引く
    newpic = cv2.line(newpic, (x1, y1), (x2, y2), (0, 0, 255), 1)
    x1, y1, x2, y2 = q
    # 赤線を引く
    newpic = cv2.line(newpic, (x1, y1), (x2, y2), (255, 0, 255), 1)
    cv2.imshow(word, newpic)
    cv2.waitKey(0)
    cv2.destroyAllWindows()


if __name__ == "__main__":
    img = cv2.imread("receipt6.jpg")
    cropImage(img)
