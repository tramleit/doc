import {Link} from "@inertiajs/react";
import TextInput from "@/Components/TextInput.jsx";
import {useState} from "react";
import {__} from "@/Libs/Lang.jsx";

export default function Pagination({nextPage, prevPage, currentPage, total, to, handleSearchChange}) {
    const [pageInput, setPageInput] = useState(currentPage || 1);
    const handleInputChange = (event) => {
        setPageInput(event.target.value);
    }
    const ChangePage = (event) => {
        handleSearchChange(event)
    }

    const NextPage = (event) => {
        setPageInput(pageInput + 1);
        handleSearchChange({target: {name: 'page', value: pageInput + 1}});
    }

    const PrevPage = (event) => {
        setPageInput(pageInput - 1);
        handleSearchChange({target: {name: 'page', value: pageInput - 1}});
    }
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            const pageNumber = parseInt(pageInput, 10); // Преобразование введенного значения в число
            if (pageNumber && !isNaN(pageNumber)) {
                handleSearchChange({target: {name: 'page', value: pageNumber}}); // Вызов функции изменения страницы с новым номером страницы
            }
        }
    }
    return (
        <nav
            className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
            aria-label="Pagination"
        >
            <div className="hidden sm:block">
                <p className="text-sm text-gray-700">
                    {__("Showed")} <span className="font-medium"> {to ? to : 0} </span> {__("from")}{' '}
                    <span className="font-medium">{total}</span>
                </p>
            </div>
            {
                handleSearchChange
                    ?
                    <div className="flex flex-1 justify-between items-center sm:justify-end">
                        <Link
                            as="button"
                            disabled={!prevPage}
                            onClick={PrevPage}
                            className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
                        >
                            {__('Previous')}
                        </Link>
                        <TextInput
                            type={"number"}
                            value={pageInput}
                            onChange={handleInputChange}
                            name={'page'}
                            onKeyPress={handleKeyPress}
                            className=" ml-2 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 border border-gray-300 text-center"
                        />
                        <Link
                            className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
                            as="button"
                            disabled={!nextPage}
                            onClick={NextPage}
                        >
                            {__('Next')}
                        </Link>

                    </div>
                    :
                    <div className="flex flex-1 justify-between items-center sm:justify-end">
                        <Link
                            as="button"
                            disabled={!prevPage}
                            href={prevPage}
                            className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
                        >
                            {__('Previous')}
                        </Link>
                        <TextInput
                            type={"number"}
                            value={pageInput}
                            disabled={true}
                            onChange={handleInputChange}
                            name={'page'}
                            onKeyPress={handleKeyPress}
                            className=" ml-2 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 border border-gray-300 text-center"
                        />
                        <Link
                            className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
                            as="button"
                            disabled={!nextPage}
                            href={nextPage}
                        >
                            {__('Next')}
                        </Link>

                    </div>
            }
        </nav>
    )
}
