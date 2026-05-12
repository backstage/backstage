import{T as P}from"./TablePagination-DQPT7dB5.js";import"./iframe-nLmXqEf7.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-BxjTy_io.js";import"./index-BcfFmlps.js";import"./Select-DwsC3GOx.js";import"./Dialog-DCU4zn0B.js";import"./Button-C296zZfo.js";import"./utils-BHAGaPmB.js";import"./Label-DiUjif3Y.js";import"./Hidden-Droxpmwn.js";import"./useFocusRing-CRF3QW5j.js";import"./openLink-52acbO8n.js";import"./useLabel-BbXuH4g9.js";import"./useLabels-Bv7MIFK3.js";import"./number-Dv4JZ_AA.js";import"./I18nProvider--lkhv8yr.js";import"./useButton-D7NyzVB-.js";import"./usePress-BTMgok7y.js";import"./textSelection-C5-Yq1FE.js";import"./useHover-DzrNdeA5.js";import"./Heading-BuXrZ9Hf.js";import"./useOverlayTriggerState-WIWunhdp.js";import"./useControlledState-I4v4Pk17.js";import"./useCollection-D-2zPf8m.js";import"./keyboard-Dzy1pKfB.js";import"./FocusScope-De3cvvw0.js";import"./useEvent-C9J8YBp8.js";import"./Autocomplete-2mvVyjFP.js";import"./useLocalizedStringFormatter-CdDwfP8u.js";import"./getItemCount-Dwowez1m.js";import"./Text-D4GNDssI.js";import"./VisuallyHidden-D6zotimm.js";import"./animation-CIIPdLix.js";import"./FieldError-JUfGZ6Pi.js";import"./useFormValidation-Coh1_1M8.js";import"./ListBox-DL9jpH_f.js";import"./useListState-DzjlCCEB.js";import"./useField-Daqylzv8.js";import"./useFormReset-Bmvk1LvB.js";import"./definition-BgPB0HuP.js";import"./Input-BueuAVR-.js";import"./SearchField-sH9LQ8oC.js";import"./useTextField-BDjP47x_.js";import"./useFilter-Iscc1qHc.js";import"./FieldLabel-Cwrz3oLT.js";import"./FieldError-BGxAebJ0.js";import"./Text-RZlq95Mg.js";import"./ButtonIcon-DxYXEFWu.js";const p=()=>{},me={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
