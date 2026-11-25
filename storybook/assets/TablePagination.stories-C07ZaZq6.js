import{T as P}from"./TablePagination-Dv1tQCUk.js";import"./iframe-T196ztmH.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-_dSsW1Fk.js";import"./index-WrKC2aIj.js";import"./Select-C8uvNUfc.js";import"./BUIRoutingProvider-DeUR7dS3.js";import"./useFocusRing-DNtHiErB.js";import"./Button-CrpaGjWm.js";import"./utils-zm3gdQCr.js";import"./Label-sNbExByb.js";import"./Hidden-BBV6Ld8l.js";import"./useLabel-BnuV1o8f.js";import"./useLabels-Cvihbbwm.js";import"./number-0emrtaiX.js";import"./I18nProvider-DNS4_F5r.js";import"./useButton-vSodW6MB.js";import"./usePress-C69aPbO8.js";import"./textSelection-BG3cATkn.js";import"./getMetaValue-DwQluMyN.js";import"./useHover-7-pgp0Ky.js";import"./FieldError-ihzqASzL.js";import"./Text-BOLLLJ4X.js";import"./Form-DCKRbBhQ.js";import"./useFormValidation-DmvJMR95.js";import"./ListBox-D80kzMkL.js";import"./useCollection-CgXGU2_i.js";import"./keyboard-CJkcO-3v.js";import"./FocusScope-BHBZvOQT.js";import"./useEvent-Cke3Ncps.js";import"./useControlledState-DuQaVgle.js";import"./useLoadMoreSentinel-BYi8Wya9.js";import"./Autocomplete-CjJ_F5TB.js";import"./useLocalizedStringFormatter-DlzBfcjg.js";import"./SelectionIndicator-C6tjeRgq.js";import"./useListState-B1UqO2Kz.js";import"./Dialog-B8P1eJ4A.js";import"./Heading-VKMd5v1x.js";import"./useOverlayTriggerState-D9Xb0gJN.js";import"./VisuallyHidden-Bk28NlY7.js";import"./animation-CpmNWIfH.js";import"./useField-BOxSzQUy.js";import"./useFormReset-CwpxsAfX.js";import"./Input-C-xGK98H.js";import"./SearchField-Ydy9J2Qd.js";import"./useTextField-CB7RKCz2.js";import"./useFilter-DzpaBCLk.js";import"./useCollectionAdapter-BEqSEnh5.js";import"./Avatar-DR_xOmEV.js";import"./Skeleton-BpZAQpsy.js";import"./FieldLabel-CimDBUnH.js";import"./FieldError-BcAJXMQJ.js";import"./Popover-CQSahvXn.js";import"./Text-DHVCUzKH.js";import"./ButtonIcon-r0XYIMXr.js";const p=()=>{},de={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:g,pageSize:m,totalCount:c})=>{const u=Math.floor((g??0)/m)+1,l=Math.ceil((c??0)/m);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
