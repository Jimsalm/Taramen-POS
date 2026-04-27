<?php

namespace App\Exports;

use Barryvdh\DomPDF\Facade\Pdf;


class ReceiptExport
{
    public function generate()
    {
        $items = 20;
        $baseWidth = 8 * 28.346;
        $baseHeight = 150;
        $rowheight = 25;

        $calculatedHeight = $baseHeight + ($items * $rowheight);
        $html = view('receipt')->render();
        $receipt = Pdf::loadHTML($html)
         ->setPaper( [0,0, 300, $calculatedHeight], 'portrait')
         ->setOptions([
            'isHtml5ParserEnabled' => true,
            'isRemoteEnabled' => true
         ]);

        return $receipt->stream('receipt.pdf');
    }
}
