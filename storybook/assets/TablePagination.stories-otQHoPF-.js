import{T as P}from"./TablePagination-BuY0sIdb.js";import"./iframe-C8vBbMI-.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-w7SDPJ-k.js";import"./index-DPsgZtqe.js";import"./Select-aMKBB6zN.js";import"./Dialog-9CEfQkon.js";import"./Button-CPFg2ZRO.js";import"./utils-CerafOdN.js";import"./Label-pU9V9ZQL.js";import"./Hidden-Y5KeQSje.js";import"./useGlobalListeners-B1a-_PtV.js";import"./openLink-B9VHRTOW.js";import"./useLabel-DCpQaTw3.js";import"./useLabels-D7tYLmjR.js";import"./number-xD8XybAE.js";import"./I18nProvider--oqaU1ds.js";import"./useButton-BaBWm-gL.js";import"./usePress-DrjxzLT9.js";import"./textSelection-CVxSjLs7.js";import"./useHover-bFr0yBE9.js";import"./Heading-BYVKxxG-.js";import"./useOverlayTriggerState-D3Y-GW09.js";import"./useControlledState-KXKKTKqf.js";import"./useCollection-B7ApLeCC.js";import"./keyboard-Db6GjkWt.js";import"./FocusScope-DjCBGgFa.js";import"./useEvent-DLU3L-Lt.js";import"./Autocomplete-Dacd6GYy.js";import"./useLocalizedStringFormatter-78qOGr4H.js";import"./getItemCount-_WgL2LTp.js";import"./Text-BkGpp61l.js";import"./VisuallyHidden-C7edqotG.js";import"./animation-CRPU3zwe.js";import"./FieldError-CkIyJwZd.js";import"./useFormValidation-BYEWQaHx.js";import"./ListBox-DRopI3bb.js";import"./useListState-bUi_r9ol.js";import"./useField-B3g5PPj7.js";import"./useFormReset-Z4CMgK74.js";import"./definition-DaMjqp6r.js";import"./Input-D0vDUCch.js";import"./SearchField-rvQLyu7r.js";import"./useTextField-aXFfJKAl.js";import"./useFilter-DZjhdSPx.js";import"./FieldLabel-73IiJhMn.js";import"./FieldError-rJ8nAtV1.js";import"./Text-BeJ1OsP5.js";import"./ButtonIcon-BjLp1jla.js";const p=()=>{},me={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
