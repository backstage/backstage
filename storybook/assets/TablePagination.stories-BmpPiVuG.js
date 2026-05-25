import{T as P}from"./TablePagination-B2dh5Ouk.js";import"./iframe-C0T-wj8W.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-DVCJqa8U.js";import"./index-Du_dfWnh.js";import"./Select-iGtpUf-3.js";import"./Dialog-5_8qf3ao.js";import"./Button-DhzuH5ZZ.js";import"./utils-DWZiO_08.js";import"./Label-BxjaI0WI.js";import"./Hidden-TcqO5tnA.js";import"./useFocusRing-joMZDsYQ.js";import"./openLink-LrDtNDVV.js";import"./useLabel-AB1yFs8D.js";import"./useLabels-CVPJplK8.js";import"./number-B425KjNH.js";import"./I18nProvider-D4QipRf_.js";import"./useButton-DNV0n_Ki.js";import"./usePress-BFwVBU5P.js";import"./textSelection-bmk5E8RR.js";import"./useHover-DyNd4yLY.js";import"./Heading-C3hEqM4m.js";import"./useOverlayTriggerState-b2C7p3pU.js";import"./useControlledState-IdCXNPGa.js";import"./useCollection-CZylOiyH.js";import"./keyboard-D3pxoLlz.js";import"./FocusScope-BiSDuiFG.js";import"./useEvent-gVCyhxLk.js";import"./Autocomplete-CU4Zs1gi.js";import"./useLocalizedStringFormatter-C4r0vgii.js";import"./getItemCount-DmRcJBp6.js";import"./Text-BBeij_j0.js";import"./VisuallyHidden-DIcdpDZQ.js";import"./animation-D45X-trV.js";import"./FieldError-Udzpxthg.js";import"./useFormValidation-B7S68TAR.js";import"./ListBox-B9E12LMC.js";import"./useListState-CpMsWCbQ.js";import"./useField-BnwYzPU7.js";import"./useFormReset-BFZu_KQ5.js";import"./definition-BknDOoGR.js";import"./Input-Czz7PdOe.js";import"./SearchField-DZOMD5JG.js";import"./useTextField-Bxn58h0_.js";import"./useFilter-DdJymrBe.js";import"./FieldLabel-tggnZ-ym.js";import"./FieldError-DS1Ro-w4.js";import"./Text-ZO3bJBTT.js";import"./ButtonIcon-C6bamR72.js";const p=()=>{},me={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
