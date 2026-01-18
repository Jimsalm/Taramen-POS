<?php

namespace App\Enum;

enum DiscountType :string
{
    case PERCENTAGE = "percentage";
    case FIXED = "fixed";
    case B1T1 = "buy1take1";
}
