<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SentController extends Controller
{
    public function index(Request $request)
    {
        $searchTerm = $request->input('search');
        $status = $request->input('status');
        $dateDone = $request->input('date_done');
        $startDate = $request->input('startDate'); // Предполагается формат 'Y-m-d'
        $endDate = $request->input('endDate');     // Предполагается формат 'Y-m-d'
        $isControlled = filter_var($request->input('is_controlled'), FILTER_VALIDATE_BOOLEAN);
        $perPage = 10; // Количество элементов на странице
        $documents = Document::
        where('category', 'sent')
            ->with(['files', 'creator', 'receivers'])
            ->search($searchTerm)
            ->isControlled($isControlled)
            ->status($status)
            ->dateDone($dateDone)
            ->createdAtBetween($startDate, $endDate)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
        if (Auth::user()->isCommonRole()) {
            return Inertia::render('Sent/index', [
                'documents' => $documents,
                'searchTerm' => $searchTerm,
                'status' => $status,
                'dateDone' => $dateDone,
                'startDate' => $startDate,
                'endDate' => $endDate,
                'is_controlled' => $isControlled,
            ]);
        }
        $userId = Auth::id(); // Или любой другой ID пользователя
        $documents = Document::where('created_by_id', $userId)
            ->with(['files', 'creator', 'receivers'])
            ->search($searchTerm)
            ->isControlled($isControlled)
            ->status($status)
            ->dateDone($dateDone)
            ->createdAtBetween($startDate, $endDate)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
        return Inertia::render('Sent/index', [
            'documents' => $documents,
            'searchTerm' => $searchTerm,
            'status' => $status,
            'dateDone' => $dateDone,
            'startDate' => $startDate,
            'endDate' => $endDate,
            'is_controlled' => $isControlled,
        ]);
    }
}
