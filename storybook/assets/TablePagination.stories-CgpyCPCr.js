import{T as P}from"./TablePagination-CyPY9LO_.js";import"./iframe-COehFrpL.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-BHWA6dkP.js";import"./index-CYTOXxsh.js";import"./Select-C9nt3W9q.js";import"./Dialog-BErBgNmi.js";import"./Button-rMyQAlpZ.js";import"./utils-BxGYbtp_.js";import"./Label-C-s0bMoy.js";import"./Hidden-B9NSBWDb.js";import"./useFocusRing-CyIiAuhH.js";import"./openLink-Df95N0dK.js";import"./useLabel-Cb9ofX0t.js";import"./useLabels-Detxonbw.js";import"./number-DrVWIJG1.js";import"./I18nProvider-Br5myQOZ.js";import"./useButton-BF_b01gr.js";import"./usePress-CbJqS0jZ.js";import"./textSelection-YdW4JvuQ.js";import"./useHover-CNA2zPmI.js";import"./Heading-D0sSc3Us.js";import"./useOverlayTriggerState-B9IWWHZ7.js";import"./useControlledState-CSz_ngLu.js";import"./useCollection-BMq8h-SI.js";import"./keyboard-DB_fWUpV.js";import"./FocusScope-HqA_lJXJ.js";import"./useEvent-Cf2aNqtT.js";import"./Autocomplete--BA8J_Ge.js";import"./useLocalizedStringFormatter-BbqczZ6k.js";import"./getItemCount-DHPEFzK2.js";import"./Text-BQn-2DM-.js";import"./VisuallyHidden-DKItX-3U.js";import"./animation-Cwd1TsQK.js";import"./FieldError-B5qu8tkn.js";import"./useFormValidation-DNprhFxo.js";import"./ListBox-BEO4QyY0.js";import"./useListState-CB-vY-kP.js";import"./useField-BqRBxmza.js";import"./useFormReset-DzQTEKtm.js";import"./definition-CoS92G8r.js";import"./Input-DfyP5AmE.js";import"./SearchField-D2wzqg49.js";import"./useTextField-CvhJUtl4.js";import"./useFilter-9lX5WE4z.js";import"./FieldLabel-aBHdEg1Z.js";import"./FieldError-D89QrEby.js";import"./Text-SzvyEfWY.js";import"./ButtonIcon-BBvQi6OB.js";const p=()=>{},me={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
