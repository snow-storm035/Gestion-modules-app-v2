<?php

    if(!function_exists('convertStringToDate'))
    {
        function convertStringToDate(string $dateString)
        {
            $date = new DateTime($dateString);
            return $date->format('Y-m-d');
        }
    }

    if(!function_exists('array_sorted')){
        function array_sorted(array $array, string $key, bool $desc){
            $sorted = [...$array];

            usort($sorted, function ($a, $b) use($desc, $key){
                return $desc ? 
                $b[$key] <=> $a[$key]:
                $a[$key] <=> $b[$key];
            });

            return $sorted;
        }
    }
?>