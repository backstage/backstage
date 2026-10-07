import{T as P}from"./TablePagination-D9Ragbtl.js";import"./iframe-WUTgIN9N.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-CHIArbS8.js";import"./index-BmfM_P7U.js";import"./Select-GhY7F9M7.js";import"./Button-uNEF8Zyb.js";import"./utils-e_ANvV3R.js";import"./Label-DYgvNgnu.js";import"./Hidden-cqxb7NEw.js";import"./useFocusRing-BzNQUgBS.js";import"./openLink-C4ChH1Hb.js";import"./useLabel-BntByxux.js";import"./useLabels-DVXgHCjp.js";import"./number-QltqjbkG.js";import"./I18nProvider-DmKJ1bjB.js";import"./useButton-D7XqHIUl.js";import"./usePress-BuMIReV1.js";import"./textSelection-DRp-kAWi.js";import"./useHover-BXi1yiSF.js";import"./FieldError-D-4pHLHL.js";import"./Text-C5GiuN3F.js";import"./useFormValidation-D2qGqtVn.js";import"./ListBox-B5ORWm7z.js";import"./useCollection-DwBHBcpG.js";import"./keyboard-JM-SeqEU.js";import"./FocusScope-opzwpQwp.js";import"./useEvent-CKbgSJqF.js";import"./useControlledState-CP3bPIEi.js";import"./getItemCount-BDATx2kJ.js";import"./Autocomplete-Dh0vErH3.js";import"./useLocalizedStringFormatter-tjpZHflc.js";import"./useListState-CGXQQQJG.js";import"./Dialog-DLURENg7.js";import"./Heading-BM2NxjtA.js";import"./useOverlayTriggerState-Cw8HJspH.js";import"./VisuallyHidden-BIpmfli2.js";import"./animation-gc98-Tq1.js";import"./useField-CM7_SpaW.js";import"./useFormReset-BwnM2z0H.js";import"./Input-BGT2LOKH.js";import"./SearchField-BoMjv0ng.js";import"./useTextField-CnER0ozT.js";import"./useFilter-CKnKZ3wo.js";import"./useCollectionAdapter-DoNnAkAG.js";import"./Avatar--5h122R1.js";import"./Skeleton-gWjEnPiZ.js";import"./FieldLabel-BHE_W-o7.js";import"./FieldError-BIz7vOwW.js";import"./Popover-C7CQIi4r.js";import"./Text-pv5oC1mf.js";import"./ButtonIcon-CBUq3vfF.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    offset: 0,
    pageSize: 10,
    totalCount: 100,
    hasNextPage: true,
    hasPreviousPage: false,
    onNextPage: noop,
    onPreviousPage: noop,
    onPageSizeChange: noop,
    showPageSizeOptions: true
  }
}`,...e.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
  }
}`,...o.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    offset: 90,
    hasNextPage: false,
    hasPreviousPage: true
  }
}`,...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    offset: 40,
    hasPreviousPage: true
  }
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    showPageSizeOptions: false
  }
}`,...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    offset: undefined
  }
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    offset: 20,
    hasPreviousPage: true,
    getLabel: ({
      offset,
      pageSize,
      totalCount
    }) => {
      const page = Math.floor((offset ?? 0) / pageSize) + 1;
      const totalPages = Math.ceil((totalCount ?? 0) / pageSize);
      return \`Page \${page} of \${totalPages}\`;
    }
  }
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    totalCount: 0,
    hasNextPage: false
  }
}`,...i.parameters?.docs?.source}}};const Pe=["Default","FirstPage","LastPage","MiddlePage","WithoutPageSizeOptions","CursorPagination","CustomLabel","EmptyState"];export{s as CursorPagination,n as CustomLabel,e as Default,i as EmptyState,o as FirstPage,a as LastPage,r as MiddlePage,t as WithoutPageSizeOptions,Pe as __namedExportsOrder,le as default};
