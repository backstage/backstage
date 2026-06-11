import{T as P}from"./TablePagination-DYt1ddWd.js";import"./iframe-BhJ5Dr2k.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-DS-cMayV.js";import"./index-_G7ugzw3.js";import"./Select-BI931DWI.js";import"./Button-ZXXBant-.js";import"./utils-BFxm53Bj.js";import"./Label-DjyrHfTs.js";import"./Hidden-B-8QiBI_.js";import"./useFocusRing-Cuqo7W1_.js";import"./openLink-aBKtIEgX.js";import"./useLabel-BNB7Xfb7.js";import"./useLabels-C0tiStcV.js";import"./number-X1S93M5A.js";import"./I18nProvider-C4_W1VA5.js";import"./useButton-DZ7zx4ID.js";import"./usePress-B-DbGsJM.js";import"./textSelection-DVShau2C.js";import"./useHover-BHUifURU.js";import"./FieldError-DRosaC4y.js";import"./Text-5XkoPjYP.js";import"./useFormValidation-CUwbtLUb.js";import"./ListBox-8yFMlrtY.js";import"./useCollection-B8nJPoiv.js";import"./keyboard-ChGE4Ait.js";import"./FocusScope-APVGxhDY.js";import"./useEvent-3zBGNLoW.js";import"./useControlledState-DxaG0Jcp.js";import"./getItemCount-2wi6nfm3.js";import"./Autocomplete-CDMSc76X.js";import"./useLocalizedStringFormatter-XUVBAnGX.js";import"./useListState-Cae-3CM-.js";import"./Dialog-zu6lwNJq.js";import"./Heading-C2l_hzxG.js";import"./useOverlayTriggerState-l4XubOzY.js";import"./VisuallyHidden-db3HmOjP.js";import"./animation-DiL64Yxu.js";import"./useField-DBA_jhsz.js";import"./useFormReset-CmU_0Ju6.js";import"./Input-Dxtml_Qg.js";import"./SearchField-O1waptt0.js";import"./useTextField-Cc3uqDkf.js";import"./useFilter-Cny_7KjO.js";import"./useCollectionAdapter-CPXMJkjT.js";import"./Avatar-DQRSfXLk.js";import"./Skeleton-BVKE5xeP.js";import"./FieldLabel-iSQCAuml.js";import"./FieldError-sLUpWrAk.js";import"./Popover-C2amoBpD.js";import"./Text-DsS5dAIu.js";import"./ButtonIcon-Cdb5WF4p.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
