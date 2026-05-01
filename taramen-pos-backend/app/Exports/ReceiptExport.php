<?php

namespace App\Exports;

use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class ReceiptExport
{
    public function generate()
    {
        $items = 20;
        $baseWidth = 8 * 28.346;
        $baseHeight = 150;
        $rowheight = 25;


        $path = public_path('storage/images/TaramenLogo.png'); //since nasa public kaya public path

        $encodedImage = base64_encode(file_get_contents($path)); //
        $mime = mime_content_type($path);
        $img = "data:{$mime};base64,{$encodedImage}";

        $payload = [
            "img" => $img
        ];

        $calculatedHeight = $baseHeight + ($items * $rowheight);
        $html = view('receipt', $payload)->render();
        $receipt = Pdf::loadHTML($html)
         ->setPaper( [0,0, 300, $calculatedHeight], 'portrait')
         ->setOptions([
            'isHtml5ParserEnabled' => true,
            'isRemoteEnabled' => true
         ]);

        return $receipt->stream('receipt.pdf');
    }
}
