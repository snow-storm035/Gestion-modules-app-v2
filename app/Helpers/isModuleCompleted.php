<?php

    if(!function_exists('isModuleHoursCompletde')){
        function isModuleHoursCompleted(float $realisation, float $nbheuresTotal){
            return $realisation >= $nbheuresTotal;
        }
    }

    if(!function_exists('isModuleCompleted')){
        function isModuleCompleted(float $realisation, float $nbheuresTotal, string $efm_realise){
            return isModuleHoursCompleted($realisation, $nbheuresTotal) && $efm_realise === "oui";
        }
    }

    




?>