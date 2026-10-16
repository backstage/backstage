import{T as P}from"./TablePagination-YCly2vq2.js";import"./iframe-BYYe_BET.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-9OXtpzcu.js";import"./index-COE7Jz9g.js";import"./Select-s0uqmkRV.js";import"./Button-DEPxcD8C.js";import"./utils-CJSyyO3-.js";import"./Label-Bs-x77sn.js";import"./Hidden-c60OiMP4.js";import"./useFocusRing-BRx5O8Da.js";import"./openLink-BON_CNZm.js";import"./useLabel-dcXziXhr.js";import"./useLabels-4i8ghj68.js";import"./number-CtW1NSkQ.js";import"./I18nProvider-rRNMaJeu.js";import"./useButton-f7nJByYc.js";import"./usePress-CdThG8-6.js";import"./textSelection-D5BzNUOh.js";import"./getMetaValue-Bn1etyTW.js";import"./useHover-DawSjhGk.js";import"./FieldError-lvCPLHt0.js";import"./Text-DCKtGqqk.js";import"./Form-DuiANyPI.js";import"./useFormValidation-DJxngnhN.js";import"./ListBox-D6VaTCxL.js";import"./useCollection-DqLEpLDM.js";import"./keyboard-DfJpn7U5.js";import"./FocusScope-D48ubNpo.js";import"./useEvent-B1WEd5Ze.js";import"./useControlledState-DguQehpe.js";import"./useLoadMoreSentinel-CNEYEidD.js";import"./Autocomplete-DPgl-JtA.js";import"./useLocalizedStringFormatter-yKTdty33.js";import"./SelectionIndicator-kuT3rs5m.js";import"./useListState-BNvxBoXz.js";import"./Dialog-5N2H3Til.js";import"./Heading-BulpGcy4.js";import"./useOverlayTriggerState-B9znxEmb.js";import"./VisuallyHidden-DOvpC764.js";import"./animation-DtpQ2ZDK.js";import"./useField-CTlO1gOc.js";import"./useFormReset-CgEuTYmc.js";import"./Input-BCQuwCc2.js";import"./SearchField-DO5H9G35.js";import"./useTextField-D_S0Erlu.js";import"./useFilter-CZi588_R.js";import"./useCollectionAdapter-B7GSnXXg.js";import"./Avatar-oBydBr5n.js";import"./Skeleton-rOPoydGc.js";import"./FieldLabel-CSp54EM_.js";import"./FieldError-DHcVDA2P.js";import"./Popover-5-bKbwvv.js";import"./Text-B33oXa7b.js";import"./ButtonIcon-I4aSAKuo.js";const p=()=>{},de={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:g,pageSize:m,totalCount:c})=>{const u=Math.floor((g??0)/m)+1,l=Math.ceil((c??0)/m);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
