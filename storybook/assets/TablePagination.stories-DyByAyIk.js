import{T as P}from"./TablePagination-CbnZydqT.js";import"./iframe-K1-r__6v.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-B6g01Sss.js";import"./index-qh46O5KH.js";import"./Select-BiDfTOPG.js";import"./Dialog-D04XGRIc.js";import"./Button-i1ES9tsK.js";import"./utils-CmXvhRmv.js";import"./Label-DB_fk5tK.js";import"./Hidden-Bruv6eby.js";import"./useGlobalListeners-hYY01nOS.js";import"./openLink-Buy5e0wx.js";import"./useLabel-DIPqeGbV.js";import"./useLabels-WOLYX76B.js";import"./number-CqVwgbk4.js";import"./I18nProvider-BOTPuHRS.js";import"./useButton-C_LWOP2v.js";import"./usePress-DFgFgQIS.js";import"./textSelection-DEpXXoD2.js";import"./useHover-BjUJEgQT.js";import"./Heading-DJVWOyt3.js";import"./useOverlayTriggerState-t3pADMOa.js";import"./useControlledState-Dy4k5Q4V.js";import"./useCollection-B-lXaARj.js";import"./keyboard-DxL8AXMs.js";import"./FocusScope-M2Rr-K_Q.js";import"./useEvent-CIbwz_kM.js";import"./Autocomplete-CvG3U5A4.js";import"./useLocalizedStringFormatter-CfiXUqON.js";import"./getItemCount-D3Pj2Gkt.js";import"./Text-NxcU8Wst.js";import"./VisuallyHidden-BRIhty-1.js";import"./animation-d11LJbXp.js";import"./FieldError-CnXsXmD3.js";import"./useFormValidation-DCdCyMkZ.js";import"./ListBox-X8o-QJQt.js";import"./useListState-TvB53Ymu.js";import"./useField-DPkfUDN-.js";import"./useFormReset-Cvno6jO2.js";import"./definition-DKkw92G9.js";import"./useTextField-AN4s7yIJ.js";import"./SearchField-e_6EFV3S.js";import"./useFilter-921X9CTX.js";import"./FieldLabel-B1aFKPPQ.js";import"./FieldError-CK3VPBrG.js";import"./Text-DRqTg2b9.js";import"./ButtonIcon-DWm1pVea.js";const p=()=>{},ge={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},a={args:{...e.args}},o={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const me=["Default","FirstPage","LastPage","MiddlePage","WithoutPageSizeOptions","CursorPagination","CustomLabel","EmptyState"];export{s as CursorPagination,n as CustomLabel,e as Default,i as EmptyState,a as FirstPage,o as LastPage,r as MiddlePage,t as WithoutPageSizeOptions,me as __namedExportsOrder,ge as default};
