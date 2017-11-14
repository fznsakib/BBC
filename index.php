<?php

# Includes the autoloader for libraries installed with composer
require __DIR__ . '/vendor/autoload.php';

header("Access-Control-Allow-Origin: *");

$link = base64_decode($_GET['query']);

$response = (new Goutte\Client)
    ->request('GET', $link)
    ->filter('.story-body p')
    ->each(function ($node) {
        return $node->text();
    });

echo str_replace('Share this with Email Facebook Messenger Messenger Twitter Pinterest WhatsApp LinkedIn Copy this link These are external links and will open in a new window', '', implode(" ", $response));
