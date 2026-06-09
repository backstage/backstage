import{T as P}from"./TablePagination-COkWTHKD.js";import"./iframe-Bfn8Z101.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-l8MwrjaE.js";import"./index-Bq907hNV.js";import"./Select-BXokQHMp.js";import"./Dialog-DVnyxgg4.js";import"./Button-BqykRIfg.js";import"./utils-XG4uf7Bo.js";import"./Label-DTda4tUe.js";import"./Hidden-BEYOsoHc.js";import"./useFocusRing-B1sGVZpz.js";import"./openLink-Wmfxce7-.js";import"./useLabel-yazlQB3y.js";import"./useLabels-TALAP0nm.js";import"./number-CHPxI77p.js";import"./I18nProvider-NTiiPa5B.js";import"./useButton-B6egp6sa.js";import"./usePress-DfmHVBjM.js";import"./textSelection-BQJZv5UG.js";import"./useHover-D3FDuVpQ.js";import"./Heading-CsZymGuS.js";import"./useOverlayTriggerState-CveHFE8r.js";import"./useControlledState-BGa_gSWX.js";import"./useCollection-B4jWqbl0.js";import"./keyboard-WoBMYIQ0.js";import"./FocusScope-BROvr5DY.js";import"./useEvent-DnWnmpZ3.js";import"./Autocomplete-DycYkxwD.js";import"./useLocalizedStringFormatter-DCds1HRH.js";import"./getItemCount-DXQU5u2S.js";import"./Text-Do5cASgj.js";import"./VisuallyHidden-DDRGuF8L.js";import"./animation-gsKp1YVM.js";import"./FieldError-B7Mg-tNJ.js";import"./useFormValidation-DuwkDbHw.js";import"./ListBox-Cfwrr84M.js";import"./useListState-DMA8nB7u.js";import"./useField-CavCtq1U.js";import"./useFormReset-xigvcDpm.js";import"./definition-BCu2bvy0.js";import"./Input-io1PLb_b.js";import"./SearchField-BR_eO0sH.js";import"./useTextField-JJgFDUPp.js";import"./useFilter-A_XtNy_m.js";import"./FieldLabel-CzjgWvhX.js";import"./FieldError-Ctf794jo.js";import"./Text-CONxh37X.js";import"./ButtonIcon-DM2D8qAb.js";const p=()=>{},me={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
