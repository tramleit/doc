import React, {useCallback, useState} from 'react';
import {Link, router, useForm} from "@inertiajs/react";
import {useDropzone} from "react-dropzone";
import InputLabel from "@/Components/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import EditorComponent from "@/Components/EditorComponent.jsx";
import {BsFileEarmarkExcelFill, BsFileEarmarkPdfFill, BsFileEarmarkWordFill} from "react-icons/bs";
import {DocumentIcon, XMarkIcon} from "@heroicons/react/24/outline/index.js";
import Select from "react-tailwindcss-select";
import {__} from '@/Libs/Lang.jsx';

const Common = ({users, deputies, typesDocuments, currentLocale}) => {
    const {data, setData, post, errors} = useForm({
        toBoss: false,
        category: '',
        status: '',
        title: '',
        description: '',
        code: '',
        is_controlled: '',
        date_done: '',
        is_read: '',
        files: [],
        receivers: [],
        deputies: [],
    });
    const [files, setFiles] = useState([]);
    const [errorResponse, setErrorResponse] = useState();
    const getContent = (htmlContentProp) => {
        setData('description', htmlContentProp);
    };
    const fnUserSelected = (value) => {
        setData('receivers', value);
    };
    const fnDeputySelected = (value) => {
        setData('deputies', value);
    };
    const onDrop = useCallback((acceptedFiles) => {
        setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
        setData('files[]', ...files);
    }, [setData, files]);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/msword': ['.docx', '.doc'],
            'application/vnd.ms-excel': ['.xls', '.xlsx'],
            'application/vnd.ms-powerpoint': ['.pptx'],
            'image/jpeg': ['.jpeg', '.png', '.jpg'],
        }
    });
    const onChangeToBoss = (event) => {
        setData('toBoss', event.target.checked)
    }

    console.log(data.toBoss)
    const removeFile = (fileIndex) => {
        setFiles((prevFiles) => prevFiles.filter((_, index) => index !== fileIndex));
    };
    const submit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('code', data.code);
        formData.append('toBoss', !!data.toBoss);
        formData.append('category', data.category);
        formData.append('status', data.status);
        formData.append('is_controlled', data.is_controlled);
        formData.append('date_done', data.date_done);
        // formData.append('is_read', data.is_read);
        // userSelected.forEach((item) => formData.append(`receivers[]`, item.id));
        data.deputies.forEach((item) => formData.append(`deputy[]`, item.value));
        data.receivers.forEach(receiver => {
            formData.append('receivers[]', receiver.value);
        });
        files.forEach(file => formData.append('files[]', file));
        router.post(route('documents.store'), formData, {
            forceFormData: true,
            onStart: () => {
                console.log("start")
            },
            onFinish: () => {
                console.log("finish")
            },
            // Обработка успешного запроса
            onSuccess: (success) => {
                console.log('success')
            },
            onError: (errors) => {
                console.log(errors)
                setErrorResponse(errors)
            }
        })
    }
    return (
        <form onSubmit={submit}>
            <div className="flex justify-between items-center space-x-2 mb-5">
                <div className={`sm:col-span-3 w-full`}>
                    <InputLabel htmlFor={"title"}>
                        {__('Title')}
                        <sup
                            className={"text-red-500 font-bold"}
                        >
                            *
                        </sup>
                    </InputLabel>
                    <TextInput
                        id="title"
                        type="text" name="title" value={data.title}
                        onChange={(event) => setData('title', event.target.value)}
                        placeholder="Title"
                        className={`block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 outline-0`}
                    />
                    <span className={"text-red-700"}>{errorResponse?.title}</span>
                </div>
                <div className={`sm:col-span-3 w-full`}>
                    <InputLabel htmlFor={"type"}>
                        {__('TypeDocument')}
                        <sup
                            className={"text-red-500 font-bold"}
                        >
                            *
                        </sup>
                    </InputLabel>
                    <select
                        name="type"
                        value={data.code}
                        id="type"
                        className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 outline-0"
                        onChange={(event) => setData('code', event.target.value)}
                    >
                        <option disabled={true} value="">
                            {__("Select")}
                        </option>
                        {typesDocuments.map((item, index) => (
                            <option value={item.code} key={index}>
                                {item.code} - {currentLocale === 'ru' ? item.type_ru : item.type_tj}
                            </option>
                        ))}
                    </select>
                    <span className={"text-red-700"}>{errorResponse?.code}</span>
                </div>
            </div>
            <div className="sm:col-span-6 mb-5">
                <label htmlFor="description"
                       className="block text-sm font-medium text-gray-700">
                    {__('Text')}
                </label>
                <div
                    className="z-10">
                    <EditorComponent getContent={getContent}/>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                    {__('TextInfo')}
                </p>
            </div>
            <div className="flex justify-between items-center space-x-2 mb-5">
                <div className={`sm:col-span-3 w-full`}>
                    <div className="flex items-center space-x-3">
                        <InputLabel htmlFor={"managers"}>
                            {__('ToTheBoss')}
                        </InputLabel>
                        <input
                            type="checkbox"
                            value={data.toBoss}
                            onChange={onChangeToBoss}
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                    </div>
                </div>
                <div className={`sm:col-span-3 w-full`}>
                    <InputLabel htmlFor={"managers"}>
                        {__('Manager')}
                    </InputLabel>
                    <Select
                        placeholder={"Интихоб кунед..."}
                        id={"receivers"}
                        noOptionsMessage={"Ин гуна истифодабарнада нест!"}
                        searchInputPlaceholder={""}
                        isSearchable
                        isMultiple
                        value={data.deputies}
                        onChange={fnDeputySelected}
                        options={deputies}
                        classNames={{
                            menuButton: ({isDisabled}) => (
                                `flex text-sm text-gray-500 border border-gray-300 rounded shadow-sm transition-all duration-300 focus:outline-none ${
                                    isDisabled
                                        ? "bg-gray-200"
                                        : "block rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                }`
                            ),
                            menu: "absolute z-10 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700",
                            listItem: ({isSelected}) => (
                                `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                    isSelected
                                        ? `text-white bg-blue-500`
                                        : `text-gray-500 hover:bg-indigo-100 hover:text-indigo-600`
                                }`
                            )
                        }}
                    />

                    {errors.deputy && <span>{errors.deputy}</span>}
                </div>

                <div className={`sm:col-span-3 w-full`}>
                    <InputLabel htmlFor={"receivers"}>
                        {__('Users')}
                    </InputLabel>
                    <Select
                        placeholder={"Интихоб кунед..."}
                        id={"receivers"}
                        noOptionsMessage={"Ин гуна истифодабарнада нест!"}
                        searchInputPlaceholder={""}
                        isSearchable
                        isMultiple
                        value={data.receivers}
                        onChange={fnUserSelected}
                        options={users}
                        classNames={{
                            menuButton: ({isDisabled}) => (
                                `flex text-sm text-gray-500 border border-gray-300 rounded shadow-sm transition-all duration-300 focus:outline-none ${
                                    isDisabled
                                        ? "bg-gray-200"
                                        : "block rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                }`
                            ),
                            menu: "absolute z-10 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700",
                            listItem: ({isSelected}) => (
                                `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                                    isSelected
                                        ? `text-white bg-blue-500`
                                        : `text-gray-500 hover:bg-indigo-100 hover:text-indigo-600`
                                }`
                            )
                        }}
                    />
                </div>
            </div>
            <div className="flex justify-between items-center space-x-2 mb-5">
                <div className={`sm:col-span-3 w-full`}>
                    <InputLabel htmlFor={"category"}>
                        {__('Category')}
                    </InputLabel>
                    <select
                        name="category"
                        value={data.category}
                        id="category"
                        className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 outline-0"
                        onChange={(event) => setData('category', event.target.value)}
                    >
                        <option disabled={true} value="">
                            Намуди категорияро интихоб кунед
                        </option>
                        <option value="inbox">Воридотӣ</option>
                        <option value="sent">Содиротӣ</option>
                    </select>
                    {errors.title && <span>{errors.title}</span>}
                </div>
                <div className={`sm:col-span-3 w-full`}>
                    <div className={"flex-col justify-between items-center"}>
                        <InputLabel htmlFor={"status"}>
                            {__('Status')}
                        </InputLabel>
                        <select
                            name="status"
                            value={data.status}
                            id="status"
                            className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 outline-0"
                            onChange={(event) => setData('status', event.target.value)}
                        >
                            <option disabled={true} value="">
                                Намуди статусро интихоб кунед
                            </option>
                            <option value="in_review">Дар баррасӣ</option>
                            <option value="reviewed">Баррасӣ шуд</option>
                        </select>
                        {errors.title && <span>{errors.title}</span>}
                    </div>
                </div>
                <div className={`sm:col-span-3 w-full`}>
                    <label htmlFor="control"
                           className="block text-sm font-medium text-gray-700">
                        {__('IsControlled')}
                    </label>
                    <div className={"flex items-center space-x-2 border border-gray-300 rounded-md  px-2 py-1.5"}>
                        <div
                            className="flex items-center h-5 space-x-2">
                            <input
                                value={data.is_controlled}
                                onChange={(event) => setData('is_controlled', event.target.checked)}
                                id="control"
                                name="control"
                                type="checkbox"
                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                            />
                            <div>
                                <input
                                    disabled={data.is_controlled ? false : true}
                                    value={data.date_done}
                                    onChange={(event) => setData('date_done', event.target.value)}
                                    type="datetime-local"
                                    className="block w-full rounded-md border-0 px-2 py-1 text-gray-900   placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 outline-0"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={'sm:col-span-6'}>
                <label htmlFor="cover-photo"
                       className="block text-sm font-medium text-gray-700">
                </label>
                <div
                    {...getRootProps()}
                    className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-indigo-300 border-dashed rounded-md ${isDragActive ? 'bg-indigo-200 border-dashed border-indigo-500' : ''}`}>
                    <div
                        className="space-y-1 text-center">
                        <input
                            type="file" {...getInputProps()}
                            className={"sr-only"}/>
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                        >
                            <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <div
                            className="flex text-sm text-gray-600">
                                          <span
                                              className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                          >
                                              {__('UploadDocuments')}
                                          </span>
                        </div>
                        <p className="text-xs text-gray-500">DOCX,
                            PDF, XLS
                            JPG</p>
                    </div>
                </div>
                <div className={'sm:col-span-6'}>
                    {files.length > 0 ? (
                            <div className={"sm:col-span-6"}>
                                <h4>Загруженные файлы:</h4>
                                <div
                                    className=" grid grid-cols-4 gap-4">
                                    {files.map((file, index) => {
                                        let extension = file.name.split(".").pop();
                                        if (extension === 'pdf') {
                                            return (
                                                <div
                                                    key={index}
                                                >
                                                    <div
                                                        className={"group/item justify-center items-center"}
                                                    >
                                                        <div
                                                            className={"group relative flex items-center justify-center"}>
                                                            <BsFileEarmarkPdfFill
                                                                className={"w-48 h-36 rounded-lg transition duration-300 ease-in-out group-hover:blur-md text-red-700"}
                                                            />
                                                            <XMarkIcon
                                                                onClick={() => removeFile(index)}
                                                                className={"text-white cursor-pointer  invisible group-hover/item:visible w-8 h-8 absolute justify-center items-center"}/>
                                                        </div>
                                                    </div>
                                                    <p className={"truncate text-center"}>{file.name}</p>
                                                </div>
                                            )
                                        } else if (extension === 'docx' || extension === 'doc') {
                                            return (
                                                <div
                                                    key={index}
                                                >
                                                    <div
                                                        className={"group/item justify-center items-center"}
                                                    >
                                                        <div
                                                            className={"group relative flex items-center justify-center"}>
                                                            <BsFileEarmarkWordFill
                                                                className={"w-48 h-36 rounded-lg transition duration-300 ease-in-out group-hover:blur-md text-blue-700"}
                                                            />
                                                            <XMarkIcon
                                                                onClick={() => removeFile(index)}
                                                                className={"text-red-700 cursor-pointer  invisible group-hover/item:visible w-8 h-8 absolute justify-center items-center"}/>
                                                        </div>
                                                    </div>
                                                    <p className={"truncate text-center"}>{file.name}</p>
                                                </div>
                                            )
                                        } else if (extension === 'xls' || extension === 'xlsx') {
                                            return (
                                                <div
                                                    key={index}
                                                >
                                                    <div
                                                        className={"group/item justify-center items-center"}
                                                    >
                                                        <div
                                                            className={"group relative flex items-center justify-center"}>
                                                            <BsFileEarmarkExcelFill
                                                                className={"w-48 h-36 rounded-lg transition duration-300 ease-in-out group-hover:blur-md text-green-700"}
                                                            />
                                                            <XMarkIcon
                                                                onClick={() => removeFile(index)}
                                                                className={"text-red-700 cursor-pointer  invisible group-hover/item:visible w-8 h-8 absolute justify-center items-center"}/>
                                                        </div>
                                                    </div>
                                                    <p className={"truncate text-center"}>{file.name}</p>
                                                </div>
                                            )
                                        } else if (extension === 'jpg' || extension === 'jpeg' || extension === 'png') {
                                            return (
                                                <div
                                                    key={index}
                                                >
                                                    <div
                                                        className={"group/item justify-center items-center"}
                                                    >
                                                        <div
                                                            className={"group relative flex items-center justify-center"}>
                                                            <img
                                                                className={"w-48 h-36 rounded-lg transition duration-300 ease-in-out group-hover:blur-md"}
                                                                src={URL.createObjectURL(file)}
                                                                alt={file.name}/>
                                                            <XMarkIcon
                                                                onClick={() => removeFile(index)}
                                                                className={"text-red-700 cursor-pointer  invisible group-hover/item:visible w-8 h-8 absolute justify-center items-center"}/>
                                                        </div>
                                                    </div>
                                                    <p className={"truncate text-center"}>{file.name}</p>
                                                </div>
                                            );
                                        } else {
                                            return (
                                                <div
                                                    key={index}
                                                >
                                                    <div
                                                        className={"group/item justify-center items-center"}
                                                    >
                                                        <div
                                                            className={"group relative flex items-center justify-center"}>
                                                            <DocumentIcon
                                                                className={"w-48 h-36 rounded-lg transition duration-300 ease-in-out group-hover:blur-md"}
                                                            />
                                                            <XMarkIcon
                                                                onClick={() => removeFile(index)}
                                                                className={"text-red-700 cursor-pointer  invisible group-hover/item:visible w-8 h-8 absolute justify-center items-center"}/>
                                                        </div>
                                                    </div>
                                                    <p className={"truncate text-center"}>{file.name}</p>
                                                </div>
                                            );
                                        }
                                    })}
                                </div>
                            </div>
                        ) :
                        null
                    }
                </div>
            </div>
            <div className="flex justify-end mt-5 space-x-2">
                <Link
                    as="button"
                    href={route('documents.index')}
                    className={"bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"}
                >
                    {__('Cancel')}
                </Link>
                <button
                    className={"bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"}
                >
                    {__('Create')}
                </button>
            </div>
        </form>
    );
};

export default Common;
