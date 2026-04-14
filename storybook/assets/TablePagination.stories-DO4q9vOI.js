import{T as P}from"./TablePagination-DVDNoqrG.js";import"./iframe-KINrIo_f.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Dv1l67z5.js";import"./useObjectRef-Cl-GJEjw.js";import"./Select-Bznsy5NG.js";import"./Dialog-Dw8Bysji.js";import"./Button-B_WSb347.js";import"./utils-Dp48jrsX.js";import"./Label-CJonN38k.js";import"./Hidden-CKUXjs7V.js";import"./useNumberFormatter-BRRCv1PA.js";import"./context-B896Pv5S.js";import"./useFocusable-CaaSd55t.js";import"./openLink-BCV1Ju3v.js";import"./useLabel-CtWiwLqZ.js";import"./useLabels-mheEzMbZ.js";import"./useButton-DEkJAlCo.js";import"./usePress-BRBPsLh-.js";import"./textSelection-1F9aHMh8.js";import"./useFocusRing-BZvEHQX6.js";import"./RSPContexts-BB815QrL.js";import"./OverlayArrow-C_Z2pH72.js";import"./useControlledState-CmWPFpjF.js";import"./SelectionManager-D9gyKx5v.js";import"./useEvent-BOGlR7Jp.js";import"./SelectionIndicator-BhnE4v6J.js";import"./Separator-BNO8xXB0.js";import"./Text-BocnvHcP.js";import"./useLocalizedStringFormatter-Xx4C-qoc.js";import"./animation-cEYBDaw2.js";import"./VisuallyHidden-B0kkQ8nV.js";import"./FieldError-CHy2zJ6h.js";import"./Form-Dteeinzj.js";import"./ListBox-Bzb_vCdk.js";import"./useListState-CvYuqVi3.js";import"./useField-CQ_siFYl.js";import"./useFormReset-CiyO9xzi.js";import"./definition-DMKpakdb.js";import"./Autocomplete-B_tF8JCw.js";import"./Input-DLCtCgi7.js";import"./SearchField-Wca4BMVc.js";import"./useFilter-6VG5hCfA.js";import"./FieldLabel-BY5E0rld.js";import"./FieldError-GNLCT64V.js";import"./Text-CNN97s-C.js";import"./ButtonIcon-Brz4gTEW.js";const p=()=>{},pe={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},a={args:{...e.args}},o={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
}`,...e.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
  }
}`,...a.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    offset: 90,
    hasNextPage: false,
    hasPreviousPage: true
  }
}`,...o.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const ge=["Default","FirstPage","LastPage","MiddlePage","WithoutPageSizeOptions","CursorPagination","CustomLabel","EmptyState"];export{s as CursorPagination,n as CustomLabel,e as Default,i as EmptyState,a as FirstPage,o as LastPage,r as MiddlePage,t as WithoutPageSizeOptions,ge as __namedExportsOrder,pe as default};
