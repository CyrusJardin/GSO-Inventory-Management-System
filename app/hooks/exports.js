'use client';

import axios from "axios";
import { elements } from "chart.js";
import { Document, Packer, Paragraph, Table, TableRow, TableCell, convertInchesToTwip, AlignmentType, TextRun, WidthType, ShadingType, Tab, BorderStyle  } from "docx";
import { saveAs } from "file-saver";
import { useEffect, useState } from "react";

export default function Exports () {
    const [user, setUser] = useState({})

    useEffect(()=>{
        const getData = async () => {
            await axios.get('/api/user/admin')
            .then(res=>{
                setUser(res.data.data)
            })
        }
        getData()
    }, [])

    const addTable = (rows, arr, details, purpose) => {
        let rearrangedArr = []
        let totalCost = 0
        let row = {}
        row['qty'] = arr.quantity
        row['unit'] = arr.item.unit
        row['desc'] = arr.item.description[0]
        row['pn'] = arr.item.property_number
        row['uc'] = arr.inventory.unit_cost
        row['total'] = arr.inventory.unit_cost * arr.quantity
        totalCost += arr.inventory.unit_cost * arr.quantity
        rearrangedArr.push(row)
        row = {}
        for (let index = 1; index < arr.item.description.length; index++) {
            row['qty'] = ''
            row['unit'] = ''
            row['desc'] = arr.item.description[index]
            row['pn'] = ''
            row['uc'] = ''
            row['total'] = ''
            rearrangedArr.push(row)
        }
        rearrangedArr.forEach(elm=>{
            console.log(elm)
            const trow = new TableRow({
                children: [
                    new TableCell({
                        columnSpan: 1,
                        width: {
                            size: 10,
                            type: WidthType.PERCENTAGE
                        },
                        children: [new Paragraph(elm['qty'].toString())]
                    }),
                    new TableCell({
                        columnSpan: 1,
                        width: {
                            size: 10,
                            type: WidthType.PERCENTAGE
                        },
                        children: [new Paragraph(elm['unit'])]
                    }),
                    new TableCell({
                        columnSpan: 5,
                        width: {
                            size: 40,
                            type: WidthType.PERCENTAGE
                        },
                        children: [new Paragraph(elm['desc'])]
                    }),
                    new TableCell({
                        columnSpan: 1,
                        width: {
                            size: 10,
                            type: WidthType.PERCENTAGE
                        },
                        children: [new Paragraph(elm['pn'])]
                    }),
                    new TableCell({
                        columnSpan: 2,
                        width: {
                            size: 15,
                            type: WidthType.PERCENTAGE
                        },
                        children: [new Paragraph(new Intl.NumberFormat("en-US", {
                            style: "decimal",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(elm['uc']))]
                    }),
                    new TableCell({
                        columnSpan: 2,
                        width: {
                            size: 15,
                            type: WidthType.PERCENTAGE
                        },
                        children: [new Paragraph(new Intl.NumberFormat("en-US", {
                            style: "decimal",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(elm['total']))]
                    }),
                ]
            })
            rows.push(trow)
        })
        const totalAmountRow = new TableRow({
            children: [
                new TableCell({
                    columnSpan: 1,
                    width: {
                        size: 10,
                        type: WidthType.PERCENTAGE
                    },
                    children: [new Paragraph("")]
                }),
                new TableCell({
                    columnSpan: 1,
                    width: {
                        size: 10,
                        type: WidthType.PERCENTAGE
                    },
                    children: [new Paragraph("")]
                }),
                new TableCell({
                    columnSpan: 5,
                    width: {
                        size: 40,
                        type: WidthType.PERCENTAGE
                    },
                    children: [new Paragraph("")]
                }),
                new TableCell({
                    columnSpan: 1,
                    width: {
                        size: 10,
                        type: WidthType.PERCENTAGE
                    },
                    children: [new Paragraph("")]
                }),
                new TableCell({
                    columnSpan: 2,
                    width: {
                        size: 15,
                        type: WidthType.PERCENTAGE
                    },
                    children: [new Paragraph("TOTAL:")]
                }),
                new TableCell({
                    columnSpan: 2,
                    width: {
                        size: 15,
                        type: WidthType.PERCENTAGE
                    },
                    children: [new Paragraph(new Intl.NumberFormat("en-US", {
                        style: "decimal",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(totalCost))]
                }),
            ]
        })
        rows.push(totalAmountRow)
        const purposeRow = new TableRow({
            children: [
                new TableCell({
                    columnSpan: 12,
                    width: {size: 100, type:WidthType.PERCENTAGE},
                    children: [new Paragraph("Purpose: "+purpose)],
                }),
            ]
        })
        rows.push(purposeRow)
        const signatureRow = new TableRow({
            children: [
                new TableCell({
                    columnSpan: 6,
                    width: {size: 50, type:WidthType.PERCENTAGE},
                    children: [
                        new Paragraph('Received from:'),
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            spacing: {
                                before: 200
                            },
                            children: [
                                new TextRun({text:user?.first_name+' '+user?.last_name,underline:{type:'single'}})
                            ]
                        }),
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            spacing: {
                                after: 200,
                            },
                            children: [
                                new TextRun('Name')
                            ]
                        }),
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({text:user?.position,underline:{type:'single'}})
                            ]
                        }),
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            spacing: {
                                after: 200,
                            },
                            children: [
                                new TextRun('Position')
                            ]
                        }),
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({text:new Date().toISOString(),underline:{type:'single'}})
                            ]
                        }),
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            spacing: {
                                after: 200,
                            },
                            children: [
                                new TextRun('Date')
                            ]
                        }),
                    ],
                }),
                new TableCell({
                    columnSpan: 6,
                    width: {size: 50, type:WidthType.PERCENTAGE},
                    children: [
                        new Paragraph('Received from:'),
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            spacing: {
                                before: 200
                            },
                            children: [
                                new TextRun({text:details.name,underline:{type:'single'}})
                            ]
                        }),
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            spacing: {
                                after: 200,
                            },
                            children: [
                                new TextRun('Name')
                            ]
                        }),
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({text:details.position,underline:{type:'single'}})
                            ]
                        }),
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            spacing: {
                                after: 200,
                            },
                            children: [
                                new TextRun('Position')
                            ]
                        }),
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({text:new Date().toISOString(),underline:{type:'single'}})
                            ]
                        }),
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            spacing: {
                                after: 200,
                            },
                            children: [
                                new TextRun('Date')
                            ]
                        }),
                    ],
                }),
            ]
        })
        rows.push(signatureRow)
        return rows
    }

    const exportARE = (arr, details, purpose) => {
        let tableRows = [
            new TableRow({
                children: [
                    new TableCell({
                        columnSpan: 12,
                        margins: {
                            top: convertInchesToTwip(0.2),
                            bottom: convertInchesToTwip(0.2),
                        },
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({text:'Acknowledgement Receipt for Equipment',size:32})
                                ]
                            }),
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({text:'LGU BULAN',size:32})
                                ]
                            })
                        ],
                    }),
                ],
            }),
            new TableRow({
                children: [
                    new TableCell({
                        columnSpan: 6,
                        width: {size: 50, type:WidthType.PERCENTAGE},
                        children: [new Paragraph("Office Department:"+details.department)],
                    }),
                    new TableCell({
                        columnSpan: 3,
                        children: [new Paragraph("IAR NO.")]
                    }),
                    new TableCell({
                        columnSpan: 3,
                        children: [new Paragraph("ARE NO.")]
                    })
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({
                        columnSpan: 1,
                        width: {
                            size: 10,
                            type: WidthType.PERCENTAGE
                        },
                        children: [new Paragraph("QTY")]
                    }),
                    new TableCell({
                        columnSpan: 1,
                        width: {
                            size: 10,
                            type: WidthType.PERCENTAGE
                        },
                        children: [new Paragraph("UNIT")]
                    }),
                    new TableCell({
                        columnSpan: 5,
                        width: {
                            size: 40,
                            type: WidthType.PERCENTAGE
                        },
                        children: [new Paragraph("Description")]
                    }),
                    new TableCell({
                        columnSpan: 1,
                        width: {
                            size: 10,
                            type: WidthType.PERCENTAGE
                        },
                        children: [new Paragraph("Property No.")]
                    }),
                    new TableCell({
                        columnSpan: 2,
                        width: {
                            size: 15,
                            type: WidthType.PERCENTAGE
                        },
                        children: [new Paragraph("Unit Cost")]
                    }),
                    new TableCell({
                        columnSpan: 2,
                        width: {
                            size: 15,
                            type: WidthType.PERCENTAGE
                        },
                        children: [new Paragraph("Total Amount")]
                    }),
                ]
            }),
        ]
        tableRows = addTable(tableRows,arr,details,purpose)
        const table = new Table({
            alignment: AlignmentType.CENTER,
            width: { size: "100%", type: "auto" },
            rows: tableRows,
        });
        const doc = new Document({
            sections: [{
                children: [table]
            }]
        })
        Packer.toBlob(doc).then((blob) => {
            saveAs(blob, details.name+"-ARE.docx");
        });
        notify('You have exported an ARE file for Employee: '+details.name)
    }

    const exportICS = (arr, details, purpose) => {
        const title = new TextRun({text:'INVENTORY CUSTODIAN SLIP',color:'FFFFFF', size:48})
        let tableRows = [
            new TableRow({
                children: [
                    new TableCell({
                        columnSpan: 12,
                        shading: {
                            fill: "FF0000",
                            type: ShadingType.CLEAR,
                            color: "FFFFFF",
                        },
                        margins: {
                            top: convertInchesToTwip(0.2),
                            bottom: convertInchesToTwip(0.2),
                        },
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [title]
                            }),
                        ]
                    })
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({
                        columnSpan: 6,
                        width: {size: 50, type:WidthType.PERCENTAGE},
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: 'Office/Department: '+details.department
                                    }),
                                    new TextRun({
                                        text: 'department',
                                        color: 'FF0000'
                                    })
                                ]
                            })
                        ]
                    }),
                    new TableCell({
                        columnSpan: 3,
                        width: {size: 25, type:WidthType.PERCENTAGE},
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun('IAR NO: '),
                                    new TextRun('iar')
                                ]
                            })
                        ]
                    }),
                    new TableCell({
                        columnSpan: 3,
                        width: {size: 25, type:WidthType.PERCENTAGE},
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun('ICS NO: '),
                                    new TextRun('ics')
                                ]
                            })
                        ]
                    })
                ]
            })
        ]
        tableRows = addTable(tableRows, arr, details, purpose)
        const table = new Table({
            alignment: AlignmentType.CENTER,
            width: { size: "100%", type: "auto" },
            rows: tableRows,
        });
        const doc = new Document({
            sections: [{
                children: [table]
            }]
        })
        Packer.toBlob(doc).then((blob) => {
            saveAs(blob, details.name+"-ICS.docx");
        });
        notify('You have exported an ICS file for Employee: '+details.name)
    }

    function formatDateToMMDDYY(date) {
        const options = { year: '2-digit', month: '2-digit', day: '2-digit' };
        const formattedDate = new Date(date).toLocaleDateString('en-US', options);
        return formattedDate;
    }

    function formatNumber(number) {
        return number.toLocaleString('en-US', {
          style: 'decimal',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
    }

    function getMonthName(monthNumber) {
        const date = new Date();
        date.setMonth(monthNumber - 1); 
        return date.toLocaleString('en-US', { month: 'long' });
    }

    const allItemTable = (arr, details, total) => {
            const tableRows = [
                new TableRow({
                    children: [
                        new TableCell({
                            columnSpan: 6,
                            width: {
                                size: 50,
                                type: WidthType.PERCENTAGE
                            },
                            borders: {
                                top: {
                                    color: 'FFFFFF'
                                },
                                bottom: {
                                    color: 'FFFFFF'
                                },
                                left: {
                                    color: 'FFFFFF'
                                },
                                right: {
                                    color: 'FFFFFF'
                                }
                            },
                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    children: [
                                        new TextRun({
                                            text: details.department,
                                            underline: true
                                        })
                                    ]
                                })
                            ]
                        }),
                        new TableCell({
                            columnSpan: 4,
                            width: {
                                size: 50,
                                type: WidthType.PERCENTAGE
                            },
                            borders: {
                                top: {
                                    color: 'FFFFFF'
                                },
                                left: {
                                    color: 'FFFFFF'
                                },
                                right: {
                                    color: 'FFFFFF'
                                }
                            },
                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.RIGHT,
                                    children: [
                                        new TextRun({
                                            text: formatNumber(total),
                                        })
                                    ]
                                })
                            ]
                        }),
                    ]
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            columnSpan: 6,
                            width: {
                                size: 50,
                                type: WidthType.PERCENTAGE
                            },
                            borders: {
                                top: {
                                    color: 'FFFFFF'
                                },
                                bottom: {
                                    color: 'FFFFFF'
                                },
                                left: {
                                    color: 'FFFFFF'
                                },
                                right: {
                                    color: 'FFFFFF'
                                }
                            },
                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    text: 'NAME OF OFFICE'
                                })
                            ]
                        }),
                        new TableCell({
                            columnSpan: 4,
                            width: {
                                size: 50,
                                type: WidthType.PERCENTAGE
                            },
                            borders: {
                                top: {
                                    color: 'FFFFFF'
                                },
                                bottom: {
                                    color: 'FFFFFF'
                                },
                                left: {
                                    color: 'FFFFFF'
                                },
                                right: {
                                    color: 'FFFFFF'
                                }
                            },
                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.RIGHT,
                                    children: [
                                        new TextRun({
                                            text: 'TOTAL COST',
                                            color: 'FF0000'
                                        })
                                    ]
                                })
                            ]
                        })
                    ]
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [
                                new Paragraph('NO')
                            ]
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: 'ARE/ICS',
                                        })
                                    ]
                                })
                            ]
                        }),
                        new TableCell({
                            children: [
                                new Paragraph('QTY')
                            ]
                        }),
                        new TableCell({
                            children: [
                                new Paragraph('ITEM')
                            ]
                        }),
                        new TableCell({
                            children: [
                                new Paragraph('DESCRIPTION')
                            ]
                        }),
                        new TableCell({
                            children: [
                                new Paragraph('PROPERTY NUMBER')
                            ]
                        }),
                        new TableCell({
                            children: [
                                new Paragraph('ISSUED ON'),
                                new Paragraph('MM/DD/YY')
                            ]
                        }),
                        new TableCell({
                            children: [
                                new Paragraph('COST')
                            ]
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: 'RETURNED',
                                            color: 'FF0000'
                                        })
                                    ]
                                })
                            ]
                        }),
                        new TableCell({
                            children: [
                                new Paragraph('REMARKS')
                            ]
                        }),
                    ]
                }),
            ]
        let index = 1
        arr.forEach(element=>{
            const cost = element.inventory.unit_cost * element.quantity
            const row = new TableRow({
                children: [
                    new TableCell({
                        columnSpan: 1,
                        children: [
                            new Paragraph(index.toString())
                        ]
                    }),
                    new TableCell({
                        columnSpan: 1,
                        children: [
                            new Paragraph(element.inventory.ics_are)
                        ]
                    }),
                    new TableCell({
                        columnSpan: 1,
                        children: [
                            new Paragraph(element.quantity.toString())
                        ]
                    }),
                    new TableCell({
                        columnSpan: 1,
                        children: [
                            new Paragraph(element.item.item_name)
                        ]
                    }),
                    new TableCell({
                        columnSpan: 1,
                        children: [
                            new Paragraph(element.item.description.join(', '))
                        ]
                    }),
                    new TableCell({
                        columnSpan: 1,
                        children: [
                            new Paragraph(element.item.property_number)
                        ]
                    }),
                    new TableCell({
                        columnSpan: 1,
                        children: [
                            new Paragraph(formatDateToMMDDYY(element.release_date)),
                        ]
                    }),
                    new TableCell({
                        columnSpan: 1,
                        children: [
                            new Paragraph(formatNumber(cost))
                        ]
                    }),
                    new TableCell({
                        columnSpan: 1,
                        children: [
                            new Paragraph(element.returned)
                        ]
                    }),
                    new TableCell({
                        columnSpan: 1,
                        children: [
                            new Paragraph(element.remarks)
                        ]
                    })
                ]
            })
            index++
            tableRows.push(row)
        })
        const table = new Table({
            rows: tableRows
        })
        return table
    }

    const exportAllItem = (arr, year, month, details, total) => {
        const sections = [
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({text: 'REPORT ON THE PHYSICAL COUNT OF INVENTORIES', bold: true})]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({text: 'INDIVIDUAL ARE & ICS', bold: true})]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({text: '(AS OF '+month+' '+year+')'})]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({text: details.name.toUpperCase(), bold: true, size: 32, underline: true})]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({text: 'NAME OF EMPLOYEE'})]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({text: details.position.toUpperCase(), bold: true, underline: true})]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                text: 'POSITION'
            })
        ]
        const table = allItemTable(arr, details, total)
        sections.push(table)
        const doc = new Document({
            sections: [{
                children: sections
            }]
        })
        Packer.toBlob(doc).then((blob) => {
            saveAs(blob, details.name+"-ARE&ICS.docx");
        });
        notify('You have exported an ARE & ICS file for Employee: '+details.name)
    }

    const exportDepartment = (arr, name, total, year, month) => {
        const sections = [
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({text: 'REPORT ON THE PHYSICAL COUNT OF INVENTORIES', bold: true})]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({text: '(PER DEPARTMENT)'})]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({text: name.toUpperCase(), bold: true, underline: true})]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({text: 'DEPARTMENT / OFFICE'})]
            }),
        ]
        const tableRows = [
            new TableRow({
                children: [
                    new TableCell({
                        columnSpan: 7,
                        width: {
                            size: 50,
                            type: WidthType.PERCENTAGE
                        },
                        borders: {
                            top: {
                                color: 'FFFFFF'
                            },
                            bottom: {
                                color: 'FFFFFF'
                            },
                            left: {
                                color: 'FFFFFF'
                            },
                            right: {
                                color: 'FFFFFF'
                            }
                        },
                        children: [
                            new Paragraph('')
                        ]
                    }),
                    new TableCell({
                        columnSpan: 4,
                        width: {
                            size: 50,
                            type: WidthType.PERCENTAGE
                        },
                        borders: {
                            top: {
                                color: 'FFFFFF'
                            },
                            left: {
                                color: 'FFFFFF'
                            },
                            right: {
                                color: 'FFFFFF'
                            }
                        },
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.RIGHT,
                                text: formatNumber(total)
                            })
                        ]
                    })
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({
                        columnSpan: 7,
                        width: {
                            size: 50,
                            type: WidthType.PERCENTAGE
                        },
                        borders: {
                            top: {
                                color: 'FFFFFF'
                            },
                            bottom: {
                                color: 'FFFFFF'
                            },
                            left: {
                                color: 'FFFFFF'
                            },
                            right: {
                                color: 'FFFFFF'
                            }
                        },
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({
                                        text: 'As of '+getMonthName(month)+' '+year,
                                        underline: true,
                                        bold: true
                                    })
                                ]
                            })
                        ]
                    }),
                    new TableCell({
                        columnSpan: 4,
                        width: {
                            size: 50,
                            type: WidthType.PERCENTAGE
                        },
                        borders: {
                            bottom: {
                                color: 'FFFFFF'
                            },
                            left: {
                                color: 'FFFFFF'
                            },
                            right: {
                                color: 'FFFFFF'
                            }
                        },
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                text: 'TOTAL COST'
                            })
                        ]
                    }),
                ]
            })
        ]
        const tablehead = new TableRow({
            children: [
                new TableCell({
                    borders: {
                        top: {
                            style: BorderStyle.THICK
                        },
                        bottom: {
                            style: BorderStyle.THICK
                        },
                        left: {
                            style: BorderStyle.THICK
                        },
                        right: {
                            style: BorderStyle.THICK
                        },
                    },
                    children: [
                        new Paragraph('NO')
                    ]
                }),
                new TableCell({
                    borders: {
                        top: {
                            style: BorderStyle.THICK
                        },
                        bottom: {
                            style: BorderStyle.THICK
                        },
                        left: {
                            style: BorderStyle.THICK
                        },
                        right: {
                            style: BorderStyle.THICK
                        },
                    },
                    children: [
                        new Paragraph('ARE/ICS')
                    ]
                }),
                new TableCell({
                    borders: {
                        top: {
                            style: BorderStyle.THICK
                        },
                        bottom: {
                            style: BorderStyle.THICK
                        },
                        left: {
                            style: BorderStyle.THICK
                        },
                        right: {
                            style: BorderStyle.THICK
                        },
                    },
                    children: [
                        new Paragraph('QTY')
                    ]
                }),
                new TableCell({
                    borders: {
                        top: {
                            style: BorderStyle.THICK
                        },
                        bottom: {
                            style: BorderStyle.THICK
                        },
                        left: {
                            style: BorderStyle.THICK
                        },
                        right: {
                            style: BorderStyle.THICK
                        },
                    },
                    children: [
                        new Paragraph('ITEM')
                    ]
                }),
                new TableCell({
                    borders: {
                        top: {
                            style: BorderStyle.THICK
                        },
                        bottom: {
                            style: BorderStyle.THICK
                        },
                        left: {
                            style: BorderStyle.THICK
                        },
                        right: {
                            style: BorderStyle.THICK
                        },
                    },
                    children: [
                        new Paragraph('DESCRIPTION')
                    ]
                }),
                new TableCell({
                    borders: {
                        top: {
                            style: BorderStyle.THICK
                        },
                        bottom: {
                            style: BorderStyle.THICK
                        },
                        left: {
                            style: BorderStyle.THICK
                        },
                        right: {
                            style: BorderStyle.THICK
                        },
                    },
                    children: [
                        new Paragraph('PROPERTY NAME')
                    ]
                }),
                new TableCell({
                    borders: {
                        top: {
                            style: BorderStyle.THICK
                        },
                        bottom: {
                            style: BorderStyle.THICK
                        },
                        left: {
                            style: BorderStyle.THICK
                        },
                        right: {
                            style: BorderStyle.THICK
                        },
                    },
                    children: [
                        new Paragraph('EMPLOYEE')
                    ]
                }),
                new TableCell({
                    borders: {
                        top: {
                            style: BorderStyle.THICK
                        },
                        bottom: {
                            style: BorderStyle.THICK
                        },
                        left: {
                            style: BorderStyle.THICK
                        },
                        right: {
                            style: BorderStyle.THICK
                        },
                    },
                    children: [
                        new Paragraph('ISSUED ON')
                    ]
                }),
                new TableCell({
                    borders: {
                        top: {
                            style: BorderStyle.THICK
                        },
                        bottom: {
                            style: BorderStyle.THICK
                        },
                        left: {
                            style: BorderStyle.THICK
                        },
                        right: {
                            style: BorderStyle.THICK
                        },
                    },
                    children: [
                        new Paragraph('COST')
                    ]
                }),
                new TableCell({
                    borders: {
                        top: {
                            style: BorderStyle.THICK
                        },
                        bottom: {
                            style: BorderStyle.THICK
                        },
                        left: {
                            style: BorderStyle.THICK
                        },
                        right: {
                            style: BorderStyle.THICK
                        },
                    },
                    children: [
                        new Paragraph('RETURNED')
                    ]
                }),
                new TableCell({
                    borders: {
                        top: {
                            style: BorderStyle.THICK
                        },
                        bottom: {
                            style: BorderStyle.THICK
                        },
                        left: {
                            style: BorderStyle.THICK
                        },
                        right: {
                            style: BorderStyle.THICK
                        },
                    },
                    children: [
                        new Paragraph('REMARKS')
                    ]
                }),
            ]
        })
        tableRows.push(tablehead)
        let index = 1
        arr.forEach(element=>{
            const cost = element.quantity * element.inventory.unit_cost
            const row = new TableRow({
                children: [
                    new TableCell({
                        children: [
                            new Paragraph(index.toString())
                        ]
                    }),
                    new TableCell({
                        children: [
                            new Paragraph(element.inventory.ics_are)
                        ]
                    }),
                    new TableCell({
                        children: [
                            new Paragraph(element.quantity)
                        ]
                    }),
                    new TableCell({
                        children: [
                            new Paragraph(element.item.item_name)
                        ]
                    }),
                    new TableCell({
                        children: [
                            new Paragraph(element.item.description.join(', '))
                        ]
                    }),
                    new TableCell({
                        children: [
                            new Paragraph(element.item.property_number)
                        ]
                    }),
                    new TableCell({
                        children: [
                            new Paragraph(element.employee.first_name+' '+element.employee.last_name)
                        ]
                    }),
                    new TableCell({
                        children: [
                            new Paragraph(formatDateToMMDDYY(element.release_date))
                        ]
                    }),
                    new TableCell({
                        children: [
                            new Paragraph(formatNumber(cost))
                        ]
                    }),
                    new TableCell({
                        children: [
                            new Paragraph(element.returned.toString())
                        ]
                    }),
                    new TableCell({
                        children: [
                            new Paragraph(element.remarks)
                        ]
                    }),
                ]
            })
            tableRows.push(row)
            index++
        })
        const table = new Table({
            width: {size: 100, type: WidthType.PERCENTAGE},
            rows: tableRows
        })
        sections.push(table)
        const doc = new Document({
            sections: [{
                children: sections
            }]
        })
        Packer.toBlob(doc).then((blob) => {
            saveAs(blob, name+"-inventories.docx");
        });
        notify('You have exported an ARE & ICS file for Department: '+name)
    }

    const notify = async message => {
        try {
            await axios.post('/api/navigation/notification/write', {message: message})
        } catch (error) {
            console.log(error)
        }
    }

    return {
        exportARE, exportICS, exportAllItem, exportDepartment
    }
}