import{T as P}from"./TablePagination-C5Miquj_.js";import"./iframe-BIybnMXI.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-CbQSD8dp.js";import"./index-DRRrr8Fx.js";import"./Select-zWcRFwk5.js";import"./Button-ejIqj8kn.js";import"./utils-BNWuCLNS.js";import"./Label-DU9qK1mL.js";import"./Hidden-CFw0S2EP.js";import"./useFocusRing-14fD-rIq.js";import"./openLink-_nIoHyS5.js";import"./useLabel-DOK2Qr8p.js";import"./useLabels-BYUTWxfw.js";import"./number-DllxhX9c.js";import"./I18nProvider-CQNLYzfm.js";import"./useButton-DMoQoLuK.js";import"./usePress-BTAge9_g.js";import"./textSelection-Dxc81R1_.js";import"./getMetaValue-BRyplxPo.js";import"./useHover-S-WcK3-g.js";import"./FieldError-BHpvYtcE.js";import"./Text-BmQ5Jf8N.js";import"./Form-BtbuUqgK.js";import"./useFormValidation-CvU55wbv.js";import"./ListBox-cv5bBszz.js";import"./useCollection-CEagf3y0.js";import"./keyboard-QYh7qiEd.js";import"./FocusScope-Dr9kUHv8.js";import"./useEvent-DIefrTiE.js";import"./useControlledState-CPQ03ATl.js";import"./useLoadMoreSentinel-BkCjiMYy.js";import"./Autocomplete-Dq4_Bll7.js";import"./useLocalizedStringFormatter-DqXT6BB6.js";import"./SelectionIndicator-Bphfg2M8.js";import"./useListState-C6sSAmPu.js";import"./Dialog-P2aWfCr-.js";import"./Heading-Bpc_kUuP.js";import"./useOverlayTriggerState-Dl82bCOM.js";import"./VisuallyHidden-BHXmXcE_.js";import"./animation-ChJpkI5_.js";import"./useField-Di3KpqBE.js";import"./useFormReset-DCi4NeAi.js";import"./Input-DW6Ftfr4.js";import"./SearchField-CExVv26X.js";import"./useTextField-DTDPL3Jy.js";import"./useFilter-dFEuKb-v.js";import"./useCollectionAdapter-CN8Wm2C0.js";import"./Avatar-Dl8uFSu7.js";import"./Skeleton-CygRmvza.js";import"./FieldLabel-BATt1FrY.js";import"./FieldError-Cpue-Cqu.js";import"./Popover-aeoPyaAm.js";import"./Text-kzCYyEIk.js";import"./ButtonIcon-B3TYP0eD.js";const p=()=>{},de={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:g,pageSize:m,totalCount:c})=>{const u=Math.floor((g??0)/m)+1,l=Math.ceil((c??0)/m);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
