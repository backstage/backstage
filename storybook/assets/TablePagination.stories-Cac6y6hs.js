import{T as P}from"./TablePagination-m41hJYTc.js";import"./iframe-B3Qnvxa_.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-BLUGjhTS.js";import"./index-CymDSTkJ.js";import"./Select-WQ6qFL6X.js";import"./Button-D7TKPyRW.js";import"./utils-If5ksnAe.js";import"./Label-Z8qmlos3.js";import"./Hidden-D0v5Fd-T.js";import"./useFocusRing-kY9ZCJul.js";import"./openLink-DUBrf5Vo.js";import"./useLabel-DtpxzJ5z.js";import"./useLabels-bYYWYrus.js";import"./number-IY6oxrwY.js";import"./I18nProvider-w0p5O94b.js";import"./useButton-D8THw0ar.js";import"./usePress-DS_kkfX7.js";import"./textSelection-C-KNkP-o.js";import"./getMetaValue-Bfb9dALM.js";import"./useHover-CMuPDAG4.js";import"./FieldError-2zCs0NXy.js";import"./Text-BFgsjRxI.js";import"./Form-CqKyLLrG.js";import"./useFormValidation-BKFLE_er.js";import"./ListBox-Xc-PGKLs.js";import"./useCollection-C0KWGunX.js";import"./keyboard-DErvBxra.js";import"./FocusScope-COFxSTVI.js";import"./useEvent-DvzpAe6X.js";import"./useControlledState-Bz4IB1Ec.js";import"./useLoadMoreSentinel-CZYOzpuH.js";import"./Autocomplete-CqjB4B8R.js";import"./useLocalizedStringFormatter-BYLeamaS.js";import"./SelectionIndicator-DAMG82yw.js";import"./useListState-0SZ5kgRY.js";import"./Dialog-BgTJWZyb.js";import"./Heading-Dmx8fNyM.js";import"./useOverlayTriggerState-eGmwqTEM.js";import"./VisuallyHidden-ctIVpEsZ.js";import"./animation-zPNoS82u.js";import"./useField-DGm2TnJi.js";import"./useFormReset-B6lNLtFj.js";import"./Input-BTZAGOQr.js";import"./SearchField-cSWY-1nh.js";import"./useTextField-4reRhcvW.js";import"./useFilter-BtlnkUu9.js";import"./useCollectionAdapter-BcxazWyt.js";import"./Avatar-B9j6SYPT.js";import"./Skeleton-DWv4LjnK.js";import"./FieldLabel-B2hIL6oi.js";import"./FieldError-Dwf09bo1.js";import"./Popover-DopUadYs.js";import"./Text-DZgbuz4B.js";import"./ButtonIcon-Djr17d_F.js";const p=()=>{},de={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:g,pageSize:m,totalCount:c})=>{const u=Math.floor((g??0)/m)+1,l=Math.ceil((c??0)/m);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
