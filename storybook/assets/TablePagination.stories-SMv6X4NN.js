import{T as P}from"./TablePagination-Pi3DYrGz.js";import"./iframe-BNSLO1vV.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-DfKP_bGf.js";import"./index-915ceJIm.js";import"./Select-Cv0xPAbm.js";import"./Button-B0vfnfY-.js";import"./utils-BgaqTVim.js";import"./Label-DzAvhi63.js";import"./Hidden-BWb7YpQ9.js";import"./useFocusRing-BWAOHlHz.js";import"./openLink-D76OisA9.js";import"./useLabel-BRSOlNNT.js";import"./useLabels-BlcH69Wp.js";import"./number-CFmIYAFH.js";import"./I18nProvider-Ct0Vubxu.js";import"./useButton-BSKANQze.js";import"./usePress-B5FaNHuw.js";import"./textSelection-mReTmyFw.js";import"./useHover-CGZzpOhk.js";import"./FieldError-DzFGWgMI.js";import"./Text-B3PwrI6a.js";import"./useFormValidation-DICvltng.js";import"./ListBox-CFDeD7rX.js";import"./useCollection-DFBi0WJc.js";import"./keyboard-CK2KOmJP.js";import"./FocusScope-DL8AivFs.js";import"./useEvent-TJw7m1NL.js";import"./useControlledState-PL9NIT9a.js";import"./getItemCount-u9xCZwNr.js";import"./Autocomplete-BQexmFy8.js";import"./useLocalizedStringFormatter-DEaeFhG_.js";import"./useListState-bSCKIYSY.js";import"./Dialog-DTgFF9wf.js";import"./Heading-vDaE-Bpm.js";import"./useOverlayTriggerState-Baeho1Ue.js";import"./VisuallyHidden-D8dNxkax.js";import"./animation-B2_q34rf.js";import"./useField-B0QwNT7y.js";import"./useFormReset-EQWShVt4.js";import"./Input-C013WslU.js";import"./SearchField-CSEHtFkT.js";import"./useTextField-C8My7CSS.js";import"./useFilter-C24k0sGf.js";import"./useCollectionAdapter-sYFClAvF.js";import"./Avatar-BJQKuhdF.js";import"./Skeleton-BXpAp4SL.js";import"./FieldLabel-CxT1gLPF.js";import"./FieldError-JGQ5ZZKy.js";import"./Popover-C0ray1_N.js";import"./Text-DSY5HhhV.js";import"./ButtonIcon-DDv33qIH.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
