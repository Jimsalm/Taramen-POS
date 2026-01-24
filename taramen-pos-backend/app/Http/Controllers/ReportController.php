<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\Order;
use App\Models\OrderItem;
use App\Services\ReportService;

class ReportController extends Controller
{
    public function __construct(protected ReportService $reportService) {

    }
    public function summary(Request $request) {
        $start = $request->get('start_date' , today()->format('Y-m-d'));
        $end = $request->get('end_date', $start);

        $summary =  $this->reportService->summaryService($start, $end) ;

        $per_employee_sales = $this->reportService->employeeService($start, $end);

        $top_item =$this->reportService->topItemService($start, $end);

        return response()->json([
            'success' => true,
            'total_sales' => $summary,
            'employees' => $per_employee_sales,
            '$top_item' => $top_item
        ]);

    }


}
