import{T as P}from"./TablePagination-DssQfh6t.js";import"./iframe-GY9q4FO8.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-DlPyeYly.js";import"./index-CbkTlW2S.js";import"./Select-BTZF23Lt.js";import"./Button-gV3JsRfd.js";import"./utils-UG8wIxPz.js";import"./Label-Bc_GMvnu.js";import"./Hidden-nquVvtJw.js";import"./useFocusRing-BlRt_wPT.js";import"./openLink-CFz-JK3Y.js";import"./useLabel-uMVcdOMo.js";import"./useLabels-DnIs0d0f.js";import"./number-B5JXBwAu.js";import"./I18nProvider-BhiwSHej.js";import"./useButton-CUs3xyC6.js";import"./usePress-CTng4HyG.js";import"./textSelection-DeC98-eF.js";import"./getMetaValue-XB_wrXKe.js";import"./useHover-BHwy1G7-.js";import"./FieldError-w98q6zCm.js";import"./Text-CCPuhEw_.js";import"./Form-CPARlShW.js";import"./useFormValidation-CIoGHvRM.js";import"./ListBox-CXOtftYI.js";import"./useCollection-DtPONGaC.js";import"./keyboard-BCJcwUXR.js";import"./FocusScope-DHVX7U6d.js";import"./useEvent-aycS7oPM.js";import"./useControlledState-BK9RR_T7.js";import"./useLoadMoreSentinel-Dss4yWwT.js";import"./Autocomplete-CrQwLSiz.js";import"./useLocalizedStringFormatter-BqaF7StP.js";import"./SelectionIndicator-ClprgyfK.js";import"./useListState-C4X4wGMp.js";import"./Dialog-CHsgvMd8.js";import"./Heading-htnlGJCA.js";import"./useOverlayTriggerState-6qevt50p.js";import"./VisuallyHidden-D2jW1EXZ.js";import"./animation-CJ3qHqN2.js";import"./useField-B4kUn8PC.js";import"./useFormReset-BLa1fi_u.js";import"./Input-DXacu7fD.js";import"./SearchField-CbVSMKK_.js";import"./useTextField-DmHH0Qdy.js";import"./useFilter-Dpa-GPDt.js";import"./useCollectionAdapter-B21PUYM-.js";import"./Avatar-DQ3o1Ks4.js";import"./Skeleton-1mpkKDFh.js";import"./FieldLabel-Cw_4QG9l.js";import"./FieldError-3YcCqC6F.js";import"./Popover-sNbkn3hR.js";import"./Text-Mxo4Je-M.js";import"./ButtonIcon-CnthuoFG.js";const p=()=>{},de={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:g,pageSize:m,totalCount:c})=>{const u=Math.floor((g??0)/m)+1,l=Math.ceil((c??0)/m);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
