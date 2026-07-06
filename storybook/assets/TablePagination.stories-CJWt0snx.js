import{T as P}from"./TablePagination-u181QoJ8.js";import"./iframe-D-U3XCi_.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-CPQl0FPH.js";import"./index-1kifiLVj.js";import"./Select-CZK672Pp.js";import"./Button-CNFlQLM7.js";import"./utils-BR4WWUPw.js";import"./Label-67Mz0DTG.js";import"./Hidden-BT-waPLA.js";import"./useFocusRing-ChTmVwiQ.js";import"./openLink-CUqeOgDt.js";import"./useLabel-D8B5Ekv6.js";import"./useLabels-CrgyuspR.js";import"./number-v8QHaCn-.js";import"./I18nProvider-QDJG5ejG.js";import"./useButton-CtCvtk7k.js";import"./usePress-D5PsofWG.js";import"./textSelection-C16VXh1L.js";import"./useHover-C7AGz9RX.js";import"./FieldError-DP0NgPGT.js";import"./Text-CA-ViSRt.js";import"./useFormValidation-DIt9J9Zd.js";import"./ListBox-tL8INFoA.js";import"./useCollection-CF2WGfOp.js";import"./keyboard-CQJNIbp7.js";import"./FocusScope-DUco4cAU.js";import"./useEvent-q-IyEWu-.js";import"./useControlledState-CXF1rY7r.js";import"./getItemCount-CsvmdeCi.js";import"./Autocomplete-BJ4aAY6l.js";import"./useLocalizedStringFormatter-CqlUbDUm.js";import"./useListState-DL4nEIqW.js";import"./Dialog-CdeEh2DO.js";import"./Heading-b4gjKqb9.js";import"./useOverlayTriggerState-BMh6qldU.js";import"./VisuallyHidden-DGDx8Mtn.js";import"./animation-DU5l6MIa.js";import"./useField-CwYjWd3d.js";import"./useFormReset-DB--Cdia.js";import"./Input-DCWvse9e.js";import"./SearchField-BEUS8UWT.js";import"./useTextField-fdQNTT2p.js";import"./useFilter-_RcD3Zjm.js";import"./useCollectionAdapter-B23xxHQz.js";import"./Avatar-46VUJHyw.js";import"./Skeleton-B8IoVq82.js";import"./FieldLabel-Yl6b1TJS.js";import"./FieldError-BrDpuaex.js";import"./Popover-k78DiQGy.js";import"./Text-ClDibDjI.js";import"./ButtonIcon-CKZEErcO.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
