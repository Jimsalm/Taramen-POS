<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Receipt</title>
    <style>
        table {
            margin: 0 auto;
            width: 300px;
            border-collapse: collapse;
        }
        td {
            padding: 5px 0 5px 0;
        }
        .value {
            width: 72px;
            text-align: right;
            white-space: nowrap;
        }
        body{
            margin : 0;
        }
        table {
            margin: 0 auto;
        }

    </style>

</head>


<body style="margin:0; ">
    <table>
        <tr>
            <td style="text-align: center;"> <img src="{{ $img }}" alt="Logo" style="width: 100px; "></td>
        </tr>

    </table>
    <table>
        <tr><td style="text-align: center; font-weight: bold; font-size: 20px">Ta'ramen</td></tr>
        <tr><td>Order: R4</td></tr>
        <tr><td>Employee: Diane</td></tr>
        <tr><td>POS: POS3</td></tr>
        <tr><td style="border-bottom: 1px dashed black"></td></tr>
        <tr><td>Dine in</td></tr>
        <tr><td style="border-bottom: 1px dashed black"></td></tr>
    </table>

    <table style="margin-top: 10px; margin-bottom: 10px">
        <tr>
            <td>Miso Ramen</td>
            <td class="value">P299</td>
        </tr>
        <tr><td colspan="2">1 x P299</td></tr>
    </table>



    <table>
        <tr ><td colspan="2" style="border-bottom: 1px dashed black"></td></tr>
    </table>

    <table>
        <tr>
            <td style=" font-weight: bold; font-size: 24px; ">Total: </td>
            <td class="value" style=" font-weight: bold; font-size: 24px;">P599</td>
        </tr>
        <tr>
            <td style="">Cash: </td>
            <td class="value">P2000</td>
        </tr>
        <tr>
            <td style="">Change: </td>
            <td class="value">P26</td>
        </tr>

    </table>


    <table>
        <tr><td colspan="2" style="border-bottom: 1px dashed black"></td></tr>
    </table>




</body>

</html>
