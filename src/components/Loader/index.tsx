"use client";

import Head from "next/head";

export default function Loader(){
    return (
        <>
            {/* Metadata */}
            <Head>
                <title>Loader - Etomovich Journals</title>
                <meta name="description" content="Etomovich Journals Loader" />
            </Head>
            <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
                <div className="container">
                    <div className="p-4 min-h-[165px] flex items-center justify-center">
                    <svg width="100" height="100" viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg" stroke="#fff">
                        <g fill="none" fillRule="evenodd" transform="translate(1 1)" strokeWidth="2">
                            <circle cx="22" cy="22" r="6" strokeOpacity="0">
                                <animate attributeName="r"
                                    begin="1.5s" dur="3s"
                                    values="6;22"
                                    calcMode="linear"
                                    repeatCount="indefinite" />
                                <animate attributeName="stroke-opacity"
                                    begin="1.5s" dur="3s"
                                    values="1;0" calcMode="linear"
                                    repeatCount="indefinite" />
                                <animate attributeName="stroke-width"
                                    begin="1.5s" dur="3s"
                                    values="2;0" calcMode="linear"
                                    repeatCount="indefinite" />
                            </circle>
                            <circle cx="22" cy="22" r="6" strokeOpacity="0">
                                <animate attributeName="r"
                                    begin="3s" dur="3s"
                                    values="6;22"
                                    calcMode="linear"
                                    repeatCount="indefinite" />
                                <animate attributeName="stroke-opacity"
                                    begin="3s" dur="3s"
                                    values="1;0" calcMode="linear"
                                    repeatCount="indefinite" />
                                <animate attributeName="stroke-width"
                                    begin="3s" dur="3s"
                                    values="2;0" calcMode="linear"
                                    repeatCount="indefinite" />
                            </circle>
                            <circle cx="22" cy="22" r="8">
                                <animate attributeName="r"
                                    begin="0s" dur="1.5s"
                                    values="6;1;2;3;4;5;6"
                                    calcMode="linear"
                                    repeatCount="indefinite" />
                            </circle>
                        </g>
                    </svg>
                    </div>
                </div>
            </section>

        </>
    );
}