import{T as P}from"./TablePagination-D0lFc8x1.js";import"./iframe-v7Qh39PS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-C2rRWsJF.js";import"./useObjectRef-D2k9dnBA.js";import"./Select-CYAIyEJI.js";import"./Dialog-CBNZkOrD.js";import"./Button-CvJRoXrp.js";import"./utils-BTRkaVxP.js";import"./Label-dqhcKEKx.js";import"./Hidden-DQKoMRUH.js";import"./useNumberFormatter-CujVYdJO.js";import"./context-DBZ4_gav.js";import"./useFocusable-RTAK5qqG.js";import"./openLink-DhJYPLui.js";import"./useLabel-EzumQXQv.js";import"./useLabels-BlAwLbEW.js";import"./useButton-DoRhoXC9.js";import"./usePress-d5tNe03t.js";import"./textSelection-BeaNrXk5.js";import"./useFocusRing-BTKZdzbY.js";import"./RSPContexts-DguNZy1G.js";import"./OverlayArrow-CIIPbG6M.js";import"./useControlledState-uHAu_Mun.js";import"./SelectionManager-B9ty4xJI.js";import"./useEvent-DftEYdn-.js";import"./SelectionIndicator-BecY6qs8.js";import"./Separator-CWjVLqSf.js";import"./Text-BTRORdui.js";import"./useLocalizedStringFormatter-CDTBWl6c.js";import"./animation-bTj1KSLO.js";import"./VisuallyHidden-IWS9gFxu.js";import"./FieldError-BZSNwmfj.js";import"./Form-DVx58Gd8.js";import"./ListBox-C_lUht65.js";import"./useListState-C6C3NGo2.js";import"./useField-C9kn4VsB.js";import"./useFormReset-BVXhgu2X.js";import"./definition-BV0eG3LV.js";import"./Autocomplete-DCIu0TcL.js";import"./Input-BfU2WQIl.js";import"./SearchField-D_JUXTWb.js";import"./useFilter-DWxqpTyu.js";import"./FieldLabel-CEzLdDl0.js";import"./FieldError-2HjdInEU.js";import"./Text-B4mDMWxC.js";import"./ButtonIcon-C3c64jj-.js";const p=()=>{},pe={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},a={args:{...e.args}},o={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
}`,...e.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
  }
}`,...a.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    offset: 90,
    hasNextPage: false,
    hasPreviousPage: true
  }
}`,...o.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const ge=["Default","FirstPage","LastPage","MiddlePage","WithoutPageSizeOptions","CursorPagination","CustomLabel","EmptyState"];export{s as CursorPagination,n as CustomLabel,e as Default,i as EmptyState,a as FirstPage,o as LastPage,r as MiddlePage,t as WithoutPageSizeOptions,ge as __namedExportsOrder,pe as default};
