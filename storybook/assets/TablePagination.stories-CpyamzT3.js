import{T as P}from"./TablePagination-DxkthSOX.js";import"./iframe-DXdR4xPj.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-CbSdwcnt.js";import"./index-DBKaRO06.js";import"./Select-DAE55_nT.js";import"./Button-lJ2CGbxt.js";import"./utils-C-HUDFAG.js";import"./Label-Zek0cQNR.js";import"./Hidden-DEL9fdLN.js";import"./useFocusRing-CYFxGxD_.js";import"./openLink-C1Sid2pZ.js";import"./useLabel-BKLzxkTR.js";import"./useLabels-D61_ZlAV.js";import"./number-YjzVCZ5M.js";import"./I18nProvider-C2KDHo4-.js";import"./useButton-BvDLj8oC.js";import"./usePress-CnZ4gSLR.js";import"./textSelection-BYJbH9-e.js";import"./useHover-DQCkeZXu.js";import"./FieldError-BWSEqUjJ.js";import"./Text-gNAEQAy_.js";import"./useFormValidation-5SPC4rhD.js";import"./ListBox-CEeIUydP.js";import"./useCollection-3GpIKzwO.js";import"./keyboard-DjhTbvoF.js";import"./FocusScope-BPEWfvie.js";import"./useEvent-Cm9ScuUm.js";import"./useControlledState-BREXAMRj.js";import"./getItemCount-Cz9MCKqo.js";import"./Autocomplete-C_htAJtr.js";import"./useLocalizedStringFormatter-CNTHe_n6.js";import"./useListState-CoMNNvPQ.js";import"./Dialog-Ddg6xAXH.js";import"./Heading-Cd_XP2oj.js";import"./useOverlayTriggerState-9MfyzaMp.js";import"./VisuallyHidden-bnSaxykT.js";import"./animation-CfYGLk_Q.js";import"./useField-RzY76_L5.js";import"./useFormReset-CLOf4j1R.js";import"./Input-BQrTLKPj.js";import"./SearchField-C-9_xXdO.js";import"./useTextField-BzN2GkCH.js";import"./useFilter-Cj_JbaCN.js";import"./useCollectionAdapter-DKtY3K__.js";import"./Avatar-LsFMTH2B.js";import"./Skeleton-Dhaz6GKc.js";import"./FieldLabel-BzJNapxE.js";import"./FieldError-CuV66dUz.js";import"./Popover-B7-SYi6V.js";import"./Text-BW0S3cTG.js";import"./ButtonIcon-B4V4tS0o.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
