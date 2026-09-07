import{T as P}from"./TablePagination-DCMo1Q8q.js";import"./iframe-DFSHFeCl.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-5J7-CqHL.js";import"./index-BHTbnh3H.js";import"./Select-CeYF1V9j.js";import"./Button-CHnTR83Q.js";import"./utils-Br_KD21J.js";import"./Label-5UBRWhey.js";import"./Hidden-Dx45ZTjH.js";import"./useFocusRing-DK7tnvLa.js";import"./openLink-BDUtlzhT.js";import"./useLabel-DvxVy_uj.js";import"./useLabels--neREfox.js";import"./number-UEiGF2v3.js";import"./I18nProvider-DTAG6ziA.js";import"./useButton-RXc6MuTs.js";import"./usePress-D5mzPi8R.js";import"./textSelection-Bpfa-ycw.js";import"./useHover-DTeONGMq.js";import"./FieldError-BPsmoLqs.js";import"./Text-CnNdo26s.js";import"./useFormValidation-Dlp-ns6i.js";import"./ListBox-B2O1GDw4.js";import"./useCollection-ugJQXbbG.js";import"./keyboard-fFFHaEtw.js";import"./FocusScope-BG-0J7KO.js";import"./useEvent-BwtYMmmR.js";import"./useControlledState-CqWOEZ5B.js";import"./getItemCount-B-1zO-xx.js";import"./Autocomplete-ERpxxjwQ.js";import"./useLocalizedStringFormatter-DIyeRDi1.js";import"./useListState-q-sJn3uB.js";import"./Dialog-BIsC4Zx2.js";import"./Heading-CAtJlgMr.js";import"./useOverlayTriggerState-DzKGkFGl.js";import"./VisuallyHidden-C2SMEw2G.js";import"./animation-BdzC1IqV.js";import"./useField-yItrfdEq.js";import"./useFormReset-C38yIenU.js";import"./Input-CC8yKmPI.js";import"./SearchField-Dj87SW5A.js";import"./useTextField-Dkd0dHrB.js";import"./useFilter-p_ans4Za.js";import"./useCollectionAdapter-69i4_61S.js";import"./Avatar-BwMj_z7T.js";import"./Skeleton-Dc6HefIM.js";import"./FieldLabel-D_HNdCVZ.js";import"./FieldError-Dbox7jPP.js";import"./Popover-D2uGfJYi.js";import"./Text-CZurOlJY.js";import"./ButtonIcon-rBps8sWw.js";const p=()=>{},le={title:"Backstage UI/TablePagination",component:P,argTypes:{offset:{control:"number"},pageSize:{control:"radio",options:[5,10,20,30,40,50]},totalCount:{control:"number"},hasNextPage:{control:"boolean"},hasPreviousPage:{control:"boolean"},showPageSizeOptions:{control:"boolean"}}},e={args:{offset:0,pageSize:10,totalCount:100,hasNextPage:!0,hasPreviousPage:!1,onNextPage:p,onPreviousPage:p,onPageSizeChange:p,showPageSizeOptions:!0}},o={args:{...e.args}},a={args:{...e.args,offset:90,hasNextPage:!1,hasPreviousPage:!0}},r={args:{...e.args,offset:40,hasPreviousPage:!0}},t={args:{...e.args,showPageSizeOptions:!1}},s={args:{...e.args,offset:void 0}},n={args:{...e.args,offset:20,hasPreviousPage:!0,getLabel:({offset:m,pageSize:g,totalCount:c})=>{const u=Math.floor((m??0)/g)+1,l=Math.ceil((c??0)/g);return`Page ${u} of ${l}`}}},i={args:{...e.args,totalCount:0,hasNextPage:!1}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
