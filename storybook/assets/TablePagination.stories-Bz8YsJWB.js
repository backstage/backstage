import{T as P}from"./TablePagination-CuNvlkl7.js";import"./iframe-DXL2wfUr.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-B4LXbu6C.js";import"./index-BXp_o7O6.js";import"./Select-DDWljt3C.js";import"./Button-BhsXa_hO.js";import"./utils-AUqHPGYf.js";import"./Label-CTSb-hLZ.js";import"./Hidden-MswoXlTM.js";import"./useFocusRing-Dz_6jVoa.js";import"./openLink-CjcP3ChZ.js";import"./useLabel-Dw1khwQq.js";import"./useLabels-CUtKyTJZ.js";import"./number-BBGa0xxY.js";import"./I18nProvider-c1tBNH4d.js";import"./useButton-n2_J4JRw.js";import"./usePress-DEPKiAoD.js";import"./textSelection-AY9oPxK_.js";import"./getMetaValue-BT-1afLR.js";import"./useHover-Ci84khs7.js";import"./FieldError-DXZIAafe.js";import"./Text-Cfqlbe-2.js";import"./Form-DQaPpS9D.js";import"./useFormValidation-C1WpA2q7.js";import"./ListBox-I69VL-h_.js";import"./useCollection-D0FRsmfu.js";import"./keyboard-jTn08MKL.js";import"./FocusScope-B3Dyywws.js";import"./useEvent-C0-PIxi7.js";import"./useControlledState-B45g810H.js";import"./useLoadMoreSentinel-1rmRafYn.js";import"./Autocomplete-_fWsJGvP.js";import"./useLocalizedStringFormatter-BmzZBpD6.js";import"./SelectionIndicator-p9s5SMTk.js";import"./useListState-CxwtVQIj.js";import"./Dialog-Iyzg3pql.js";import"./Heading-FvuJcQ_2.js";import"./useOverlayTriggerState-CXXMw3IC.js";import"./VisuallyHidden-CS-IfeTZ.js";import"./animation-BTqVon43.js";import"./useField-ObDL9HD8.js";import"./useFormReset-DI4gv__R.js";import"./Input-DQSbawvQ.js";import"./SearchField--YnbST4n.js";import"./useTextField-5QRXTDDq.js";import"./useFilter-CB94jdj4.js";import"./useCollectionAdapter-D0gkGZzy.js";import"./Avatar-BRi7XETR.js";import"./Skeleton-B6iNhAkG.js";import"./FieldLabel-BOzx18aQ.js";import"./FieldError-C878VxlP.js";import"./Popover-B5xzYqHk.js";import"./Text-P2RscAk4.js";import"./ButtonIcon-QBhAzv3P.js";const p=()=>{},de={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:g,pageSize:m,totalCount:c})=>{const u=Math.floor((g??0)/m)+1,l=Math.ceil((c??0)/m);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const he=["Default","FirstPage","LastPage","MiddlePage","WithoutPageSizeOptions","CursorPagination","CustomLabel","EmptyState"];export{s as CursorPagination,n as CustomLabel,e as Default,i as EmptyState,o as FirstPage,a as LastPage,r as MiddlePage,t as WithoutPageSizeOptions,he as __namedExportsOrder,de as default};
