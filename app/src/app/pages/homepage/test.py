def findEarliestMonth(stockPrice):
    month = 0
    change = max(stockPrice)
    l = []
    while(len(stockPrice) > 1):
        l.append(stockPrice.pop(0))
        avg1 = sum(l) // len(l)
        avg2 = sum(stockPrice) // len(stockPrice)
        if(abs(avg1-avg2) < change):
            change = abs(avg1-avg2)
            month = len(l)
    return month


def temp(stockPrice):
    change = max(stockPrice)
    totalSum = sum(stockPrice)
    totalLen = len(stockPrice)
    for idx, i in enumerate(stockPrice[0 : len(stockPrice) // 2 + 1]):
        if idx == len(stockPrice) - 1:
            break
        sum1 = sum(stockPrice[0: idx + 1])
        len1 = len(stockPrice[0: idx + 1])
        avg1 = sum1 // len1
        avg2 = (totalSum - sum1) // (totalLen - len1)
        if(abs(avg1-avg2) < change):
            change = abs(avg1-avg2)
            month = idx + 1
    return month


def findMinNetPriceMonth1(stockPrices):
    bestMonth = 0
    minNetPrice = float("inf")  # replaced on the first trip through the loop
    total = sum(stockPrices)
    runningTotal = 0
    numMonths = len(stockPrices)
    for month, value in enumerate(stockPrices, start=1):
        if (month == numMonths):
            break  # avoid dividing by zero in a few lines
        runningTotal += value
        avgSoFar = runningTotal//month
        avgAfterward = (total-runningTotal)//(numMonths-month)
        netPrice = abs(avgSoFar-avgAfterward)
        if (netPrice < minNetPrice):
            minNetPrice = netPrice
            bestMonth = month
    return bestMonth


stockPrice = [1, 3, 2, 3]
print(temp(stockPrice))


# def findMinNetPriceMonth1(stockPrices):
#     bestMonth = 0
#     minNetPrice = float("inf") # replaced on the first trip through the loop
#     total = sum(stockPrices)
#     runningTotal = 0
#     numMonths = len(stockPrices)
#     for month,value in enumerate(stockPrices,start=1):
#         if ( month==numMonths ):
#             break # avoid dividing by zero in a few lines
#         runningTotal += value
#         avgSoFar = runningTotal//month
#         avgAfterward = (total-runningTotal)//(numMonths-month)
#         netPrice = abs(avgSoFar-avgAfterward)
#         if ( netPrice < minNetPrice ):
#             minNetPrice = netPrice
#             bestMonth = month
#     return bestMonth
