import{T as P}from"./TablePagination-BVeAUHaF.js";import"./iframe-4nxqZpQH.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-CnTOzlP3.js";import"./index-CS0rKBQt.js";import"./Select-CpMg1zHD.js";import"./BUIRoutingProvider-Du5oqrd5.js";import"./useFocusRing-DLLTypMY.js";import"./Button-DcUmzCDo.js";import"./utils-B_CpPLsC.js";import"./Label-DFDy7rWc.js";import"./Hidden-BHEINN-B.js";import"./useLabel-B3SXQ9nf.js";import"./useLabels-LZrLLl2Z.js";import"./number-CWCm_kOs.js";import"./I18nProvider-C7-lUSN5.js";import"./useButton-kIYEhZRP.js";import"./usePress-IehbRc7n.js";import"./textSelection-BqsoCXBu.js";import"./getMetaValue-yJ3DJPKd.js";import"./useHover-6QHjRx59.js";import"./FieldError-BXBChgnT.js";import"./Text-CLYtJTsR.js";import"./Form-CqRLvZ1x.js";import"./useFormValidation-ZZF8mbB2.js";import"./ListBox-CXErTZBH.js";import"./useCollection-BK1naX3I.js";import"./keyboard-DrZcZ53x.js";import"./FocusScope-DlgAda7i.js";import"./useEvent-C0ADcz5S.js";import"./useControlledState-BipTuFfk.js";import"./useLoadMoreSentinel-B02Bo39W.js";import"./Autocomplete-DCUHQcUI.js";import"./useLocalizedStringFormatter-4T10-1Qu.js";import"./SelectionIndicator-qqCHqb3k.js";import"./useListState-B4w7DXJu.js";import"./Dialog-DAjHlvOp.js";import"./Heading-Bpva74LM.js";import"./useOverlayTriggerState-_agSFwEY.js";import"./VisuallyHidden-DBTOudP9.js";import"./animation-Drc_DBoe.js";import"./useField-C-Ng_aIY.js";import"./useFormReset-0ATPKRb6.js";import"./Input-Cdk-ot_F.js";import"./SearchField-9UZ2-WMN.js";import"./useTextField-NQJPnPp0.js";import"./useFilter-CfSo70hf.js";import"./useCollectionAdapter-KlRWy1q8.js";import"./Avatar-BNAf3QW-.js";import"./Skeleton-7SbIFtvD.js";import"./FieldLabel-DCVsj_35.js";import"./FieldError-BIKLbZO6.js";import"./Popover-B3Wd-8eH.js";import"./Text-BR7AZu71.js";import"./ButtonIcon-NeuaoulJ.js";const p=()=>{},de={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:g,pageSize:m,totalCount:c})=>{const u=Math.floor((g??0)/m)+1,l=Math.ceil((c??0)/m);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
