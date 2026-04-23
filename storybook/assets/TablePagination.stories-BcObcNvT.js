import{T as P}from"./TablePagination-T2W3Le9N.js";import"./iframe-BkP0WlJq.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-Mf4vhbTH.js";import"./index-nUlAPM-b.js";import"./Select-BPgq2acF.js";import"./Dialog-DqD0WvZa.js";import"./Button-lxle6TI0.js";import"./utils-DHN8Cm_h.js";import"./Label-BK2ZKRuT.js";import"./Hidden-BXffHnFQ.js";import"./useGlobalListeners-BQ7uMXZm.js";import"./openLink-DB0Ca1x8.js";import"./useLabel-5YOqhmr6.js";import"./useLabels-B-zEBY3m.js";import"./number-C1OYSHYA.js";import"./I18nProvider-DmxvoEIH.js";import"./useButton-DhjtCbFy.js";import"./usePress-C8fD9tc5.js";import"./textSelection-BKZ9NYIi.js";import"./useHover-eAsT_Ppr.js";import"./Heading-4X8_LMGL.js";import"./useOverlayTriggerState-yqAD7bBJ.js";import"./useControlledState-BVQM9Nh9.js";import"./useCollection-CmpO0ThD.js";import"./keyboard-D1MAaepU.js";import"./FocusScope-JZzM0yEB.js";import"./useEvent-CwHxOE_a.js";import"./Autocomplete-J1lADh76.js";import"./useLocalizedStringFormatter-Cg_1Wz50.js";import"./getItemCount-DDe4w_9O.js";import"./Text-DkMI-_Pd.js";import"./VisuallyHidden-D5NF5zlS.js";import"./animation-X88qEdj0.js";import"./FieldError-CXhtOli2.js";import"./useFormValidation-DdoBKiVP.js";import"./ListBox-D-vi6RK-.js";import"./useListState-Bo3ieulJ.js";import"./useField-DMvdg4ts.js";import"./useFormReset-C4fnlQFd.js";import"./definition-s-I65Wul.js";import"./Input-ByYqn8b2.js";import"./SearchField-F9f7PmCT.js";import"./useTextField-BzdYefQX.js";import"./useFilter-BHxP1hpK.js";import"./FieldLabel-CM2Gayl7.js";import"./FieldError-Bd5ieprW.js";import"./Text-UTxkE-7j.js";import"./ButtonIcon-CmBjjN0V.js";const p=()=>{},me={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
