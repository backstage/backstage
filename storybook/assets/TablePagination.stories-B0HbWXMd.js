import{T as P}from"./TablePagination-CfK-ChZR.js";import"./iframe-CwGYDpYH.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-BLdCmDNN.js";import"./index-zV1ySdbQ.js";import"./Select-Dl-GNXMb.js";import"./Dialog-EbXxqGt2.js";import"./Button-CkSLB3SJ.js";import"./utils-Cp-Yx8Dx.js";import"./Label-VngP_PCJ.js";import"./Hidden-BIN5-_pJ.js";import"./useFocusRing-CsY8JheF.js";import"./openLink-Ds4I99G_.js";import"./useLabel-4uvRVmKe.js";import"./useLabels-CfNqgJqs.js";import"./number-DJ_eZXJu.js";import"./I18nProvider-SX5Amjdy.js";import"./useButton-CtJsoNcc.js";import"./usePress-Cc77xHsf.js";import"./textSelection-CA216veY.js";import"./useHover-Be8TzpC8.js";import"./Heading-Ba3Z72mw.js";import"./useOverlayTriggerState-C3EIV5Ta.js";import"./useControlledState-Cn52zD0h.js";import"./useCollection-czdlv3MZ.js";import"./keyboard-DLLhyonf.js";import"./FocusScope-D4SOuGAC.js";import"./useEvent-DYwbjjw0.js";import"./Autocomplete-BrgDjI-e.js";import"./useLocalizedStringFormatter-DMuSLF1w.js";import"./getItemCount-Cv933Zvt.js";import"./Text-DBUj1pnT.js";import"./VisuallyHidden-D5M4n7HU.js";import"./animation-T6HHZen5.js";import"./FieldError-CECOOI2C.js";import"./useFormValidation-DBKMYoZ7.js";import"./ListBox-D90wieCt.js";import"./useListState-D2aLMd28.js";import"./useField-QJgOwdZz.js";import"./useFormReset-DmlFrmJI.js";import"./definition-DQA-QrTA.js";import"./Input-o-KIrBdv.js";import"./SearchField-DSgymj46.js";import"./useTextField-DoWt_bQy.js";import"./useFilter-BqVi6c7Y.js";import"./FieldLabel-GeCGgbt5.js";import"./FieldError-Bg8SOMos.js";import"./Text-DK_d1bQc.js";import"./ButtonIcon-Dfff7LGu.js";const p=()=>{},me={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const ce=["Default","FirstPage","LastPage","MiddlePage","WithoutPageSizeOptions","CursorPagination","CustomLabel","EmptyState"];export{s as CursorPagination,n as CustomLabel,e as Default,i as EmptyState,o as FirstPage,a as LastPage,r as MiddlePage,t as WithoutPageSizeOptions,ce as __namedExportsOrder,me as default};
