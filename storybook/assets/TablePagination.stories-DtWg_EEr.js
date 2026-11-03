import{T as P}from"./TablePagination-D9opqZjo.js";import"./iframe-BteMx7zj.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-Dv9hKxnj.js";import"./index-Dfq8zbsI.js";import"./Select-NplZmVbv.js";import"./Button-DbBRcBsa.js";import"./utils-Csf2qqlx.js";import"./Label-BS5nCX70.js";import"./Hidden-DJWYjR2p.js";import"./useFocusRing-Yxf_B4Dt.js";import"./openLink-8VSUUPMi.js";import"./useLabel-CNCzQYRH.js";import"./useLabels-DAYEkzeR.js";import"./number-B2HcLMyw.js";import"./I18nProvider-D7X1BqX1.js";import"./useButton-B0unMpfY.js";import"./usePress-Cuj1vnv1.js";import"./textSelection-pyBJCDu1.js";import"./getMetaValue-CM24UgTH.js";import"./useHover-ZUHUyvdU.js";import"./FieldError-1bM4kudQ.js";import"./Text-DAa_N41I.js";import"./Form-DxoMSjVw.js";import"./useFormValidation-DeKlK0iK.js";import"./ListBox-ByGB9dy0.js";import"./useCollection-hncYRQ94.js";import"./keyboard-BDZOpMnZ.js";import"./FocusScope-DSCzOVHt.js";import"./useEvent-zyxRaVJO.js";import"./useControlledState-B_XVpnvb.js";import"./useLoadMoreSentinel-CLmS5r8T.js";import"./Autocomplete-DEoGXkkT.js";import"./useLocalizedStringFormatter-BUNRCctA.js";import"./SelectionIndicator-D0UsIo-u.js";import"./useListState-29l-qECp.js";import"./Dialog-Q5LNQ4z6.js";import"./Heading-D791aLfH.js";import"./useOverlayTriggerState-jQQVBlrg.js";import"./VisuallyHidden-C_bCbf5d.js";import"./animation-HCfLZl62.js";import"./useField-Dmr5l1Md.js";import"./useFormReset-BkRpFdO1.js";import"./Input-D1pCj6QR.js";import"./SearchField-D1zyAJHi.js";import"./useTextField-DURVcyoY.js";import"./useFilter-CfxRQt9S.js";import"./useCollectionAdapter-DmA3edDw.js";import"./Avatar-B-HoEB9f.js";import"./Skeleton-DXUa95DC.js";import"./FieldLabel-DiyqV3mj.js";import"./FieldError-BVEMZcZy.js";import"./Popover-BHY7nWIr.js";import"./Text-PuNIUZgT.js";import"./ButtonIcon-BMdh_09p.js";const p=()=>{},de={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:g,pageSize:m,totalCount:c})=>{const u=Math.floor((g??0)/m)+1,l=Math.ceil((c??0)/m);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
