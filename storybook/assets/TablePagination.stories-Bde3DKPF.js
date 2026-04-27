import{T as P}from"./TablePagination-_5XmWLrI.js";import"./iframe-UdCk74ed.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-DhhSMZ5h.js";import"./index-Uvec1qyj.js";import"./Select-DeFvvf_H.js";import"./Dialog-jZZTh3Ai.js";import"./Button-KdQHxdij.js";import"./utils-DBWR8goz.js";import"./Label-DKN-43JP.js";import"./Hidden-z08nXuDR.js";import"./useGlobalListeners-DZtXWnZU.js";import"./openLink-CyZ-ce7w.js";import"./useLabel-D5B70Cjo.js";import"./useLabels-BlyDr81M.js";import"./number-TV31rseh.js";import"./I18nProvider-Bkoj20Wt.js";import"./useButton--ea3emsG.js";import"./usePress-C3x87h-D.js";import"./textSelection-C9z5Ez2O.js";import"./useHover-bBIije97.js";import"./Heading-ZOSed7o9.js";import"./useOverlayTriggerState-0PaGTzPx.js";import"./useControlledState-DZ-pWBU1.js";import"./useCollection-CFmSqBDo.js";import"./keyboard-saoZBt-T.js";import"./FocusScope-CJqPxdoO.js";import"./useEvent-CfiC_kPm.js";import"./Autocomplete-BSrmdtTs.js";import"./useLocalizedStringFormatter-u5T1Fk6c.js";import"./getItemCount-DdnS_Qvw.js";import"./Text-B6PxkOz7.js";import"./VisuallyHidden-DO5mbmtY.js";import"./animation-BDqp4EMr.js";import"./FieldError-DoY9AUNK.js";import"./useFormValidation-6yachRsj.js";import"./ListBox-inTDlBjN.js";import"./useListState-B-mwhhXX.js";import"./useField-Ct7yOJ9P.js";import"./useFormReset-D_zt92C3.js";import"./definition-LP4YtGz1.js";import"./Input-CDmChuE5.js";import"./SearchField-Bq6BeUHF.js";import"./useTextField-D9uATknk.js";import"./useFilter-DxuqSdys.js";import"./FieldLabel-Bw-2vb_p.js";import"./FieldError-CpcfeIz8.js";import"./Text-B8EBnNV8.js";import"./ButtonIcon-BzIQAahI.js";const p=()=>{},me={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const ce=["Default","FirstPage","LastPage","MiddlePage","WithoutPageSizeOptions","CursorPagination","CustomLabel","EmptyState"];export{s as CursorPagination,n as CustomLabel,e as Default,i as EmptyState,o as FirstPage,a as LastPage,r as MiddlePage,t as WithoutPageSizeOptions,ce as __namedExportsOrder,me as default};
