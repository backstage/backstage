import{aO as y,aP as P,j as e,r as _,p as V}from"./iframe-BboAvpku.js";import{$ as I,a as T,b as q,c as F,d as R,e as H,f as G,g as M,h as A,i as h,j as C,k as w,l as E}from"./DatePicker-CPTGFejl.js";import{$ as x}from"./Button-lIgsiol8.js";import{c as U}from"./Input-AtSeLTwI.js";import{F as O,v as Y,r as Z}from"./index-CsJ4-CBU.js";import{$ as J}from"./Heading-C6khwK_V.js";import{F as K}from"./FieldLabel-0cuqdPLL.js";import{F as Q}from"./FieldError-DuYOBgJ-.js";import{P as X}from"./Popover-DxlCMonk.js";import{$ as ee}from"./Form-D3ZC0YgV.js";import{$ as ae}from"./I18nProvider-XE_7i8YB.js";import{B as re}from"./Button-BNvKJHsm.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-RjN6cOlV.js";import"./useObjectRef-BBnfzFd-.js";import"./Text-sLtLFVg2.js";import"./Hidden-B9xv55fQ.js";import"./useFocusRing-BIuw5o9K.js";import"./openLink-TmJYTFGY.js";import"./useLocalizedStringFormatter-DAXqnvE_.js";import"./useLabels-C3K2MhXi.js";import"./useUpdateEffect-Dv933qJg.js";import"./useLoadMoreSentinel-BTIDvwXh.js";import"./useCollection-DOTSVmf0.js";import"./keyboard-BM3A22Pr.js";import"./getMetaValue-Dkox27la.js";import"./FocusScope-DLqV_vIF.js";import"./useEvent-SPsT6SeD.js";import"./usePress-DjSnnouJ.js";import"./textSelection-CDb6_zJX.js";import"./useControlledState-DOt2_KtG.js";import"./useHover-Cg57FJ61.js";import"./VisuallyHidden-myxmTh9b.js";import"./useField-CNx3ldnW.js";import"./useLabel-BJaNI2Tj.js";import"./useFormReset-D33UvyuP.js";import"./useFormValidation-CpFVQ1y7.js";import"./useFilter-DbXnACEx.js";import"./useSpinButton-CD7gU4p4.js";import"./number-2cz8Gb4T.js";import"./Dialog-B9iODim2.js";import"./useOverlayTriggerState-Bs6TYJ4q.js";import"./Autocomplete-BCDxmfrb.js";import"./SelectionIndicator-UkpCWI-H.js";import"./animation-8A7n9uPm.js";import"./FieldError-BP_cnqYJ.js";import"./Label-CSCfT4hg.js";import"./useButton-Cy5D_Qbf.js";const $={"bui-DatePicker":"_bui-DatePicker_1wd3j_24","bui-DatePickerGroup":"_bui-DatePickerGroup_1wd3j_36","bui-DatePickerButton":"_bui-DatePickerButton_1wd3j_87","bui-DatePickerDateInput":"_bui-DatePickerDateInput_1wd3j_98","bui-DatePickerSegment":"_bui-DatePickerSegment_1wd3j_118","bui-DatePickerCalendar":"_bui-DatePickerCalendar_1wd3j_193","bui-DatePickerCalendarHeader":"_bui-DatePickerCalendarHeader_1wd3j_198","bui-DatePickerCalendarHeading":"_bui-DatePickerCalendarHeading_1wd3j_205","bui-DatePickerCalendarNavButton":"_bui-DatePickerCalendarNavButton_1wd3j_215","bui-DatePickerCalendarGrid":"_bui-DatePickerCalendarGrid_1wd3j_248","bui-DatePickerCalendarHeaderCell":"_bui-DatePickerCalendarHeaderCell_1wd3j_254","bui-DatePickerCalendarCell":"_bui-DatePickerCalendarCell_1wd3j_268"},te=y()({styles:$,classNames:{root:"bui-DatePicker"},propDefs:{size:{dataAttribute:!0,default:"small"},className:{},label:{},description:{},secondaryLabel:{}}}),ie=y()({styles:$,classNames:{root:"bui-DatePickerGroup",dateInput:"bui-DatePickerDateInput",segment:"bui-DatePickerSegment",button:"bui-DatePickerButton"},bg:"consumer",propDefs:{}}),se=y()({styles:$,classNames:{root:"bui-DatePickerCalendar",header:"bui-DatePickerCalendarHeader",heading:"bui-DatePickerCalendarHeading",navButton:"bui-DatePickerCalendarNavButton",grid:"bui-DatePickerCalendarGrid",gridHeader:"bui-DatePickerCalendarGridHeader",headerCell:"bui-DatePickerCalendarHeaderCell",gridBody:"bui-DatePickerCalendarGridBody",cell:"bui-DatePickerCalendarCell"},propDefs:{}}),N=({dataSize:r})=>{const{ownProps:a,dataAttributes:i}=P(ie,{}),{classes:s}=a;return e.jsxs(U,{className:s.root,...i,...r?{"data-size":r}:{},children:[e.jsx(I,{className:s.dateInput,children:o=>e.jsx(T,{segment:o,className:s.segment})}),e.jsx(x,{className:s.button,"aria-label":"Open calendar",children:e.jsx(O,{size:16,"aria-hidden":"true"})})]})};N.__docgenInfo={description:`Custom field group for DatePicker — renders a single DateInput field
and a calendar trigger button.

@internal`,methods:[],displayName:"DatePickerGroup",props:{dataSize:{required:!1,tsType:{name:"string"},description:""}}};const S=()=>{const{ownProps:r}=P(se,{}),{classes:a}=r;return e.jsxs(q,{className:a.root,children:[e.jsxs("header",{className:a.header,children:[e.jsx(x,{slot:"previous",className:a.navButton,children:e.jsx(Y,{size:16,"aria-hidden":"true"})}),e.jsx(J,{className:a.heading}),e.jsx(x,{slot:"next",className:a.navButton,children:e.jsx(Z,{size:16,"aria-hidden":"true"})})]}),e.jsxs(F,{className:a.grid,children:[e.jsx(R,{className:a.gridHeader,children:i=>e.jsx(H,{className:a.headerCell,children:i})}),e.jsx(G,{className:a.gridBody,children:i=>e.jsx(M,{className:a.cell,date:i})})]})]})};S.__docgenInfo={description:`Calendar popover content for DatePicker — renders the Calendar with
navigation and a full calendar grid.

@internal`,methods:[],displayName:"DatePickerCalendar"};const n=_.forwardRef((r,a)=>{const{ownProps:i,restProps:s,dataAttributes:o}=P(te,r),{classes:B,label:k,description:L,secondaryLabel:W}=i,j=s["aria-label"],v=s["aria-labelledby"];_.useEffect(()=>{!k&&!j&&!v&&console.warn("DatePicker requires either a visible label, aria-label, or aria-labelledby for accessibility")},[k,j,v]);const z=W||(s.isRequired?"Required":null);return e.jsxs(A,{className:B.root,...o,...s,ref:a,children:[e.jsx(K,{label:k,secondaryLabel:z,description:L,descriptionSlot:"description"}),e.jsx(N,{dataSize:o["data-size"]}),e.jsx(Q,{}),e.jsx(X,{hideArrow:!0,children:e.jsx(S,{})})]})});n.displayName="DatePicker";n.__docgenInfo={description:`A date picker that combines a date field and a calendar popover, allowing
users to enter or select a date with full keyboard and screen reader
accessibility.

@public`,methods:[],displayName:"DatePicker",props:{size:{required:!1,tsType:{name:"union",raw:"'small' | 'medium' | Partial<Record<Breakpoint, 'small' | 'medium'>>",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]}],raw:"Record<Breakpoint, 'small' | 'medium'>"}],raw:"Partial<Record<Breakpoint, 'small' | 'medium'>>"}]},description:`The size of the date picker
@defaultValue 'small'`},className:{required:!1,tsType:{name:"string"},description:""},label:{required:!1,tsType:{name:"FieldLabelProps['label']",raw:"FieldLabelProps['label']"},description:""},description:{required:!1,tsType:{name:"FieldLabelProps['description']",raw:"FieldLabelProps['description']"},description:""},secondaryLabel:{required:!1,tsType:{name:"FieldLabelProps['secondaryLabel']",raw:"FieldLabelProps['secondaryLabel']"},description:""}},composes:["Omit"]};const t=V.meta({title:"Backstage UI/DatePicker",component:n,args:{style:{width:280}}}),d=t.story({args:{}}),c=t.story({args:{label:"Date"}}),p=t.story({args:{label:"Date",description:"Select the date of your event."}}),u=t.story({args:{label:"Booking date",defaultValue:h("2025-02-03")}}),m=t.story({args:{label:"Date"},render:r=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem",width:280},children:[e.jsx(n,{...r,size:"small",label:"Small"}),e.jsx(n,{...r,size:"medium",label:"Medium"})]})}),b=t.story({args:{label:"Trip date",isRequired:!0},render:r=>e.jsxs(ee,{onSubmit:a=>{a.preventDefault()},style:{display:"flex",flexDirection:"column",gap:"1rem",width:280},children:[e.jsx(n,{...r}),e.jsx(re,{type:"submit",children:"Submit"})]})}),f=t.story({args:{label:"Date",isDisabled:!0,defaultValue:h("2025-03-01")}}),D=t.story({args:{label:"Date",isInvalid:!0,errorMessage:"The selected date is not available.",defaultValue:h("2025-04-01")}}),g=t.story({args:{label:"Date",description:"You can only select dates within the next 30 days.",minValue:C(w()),maxValue:C(w()).add({days:30})}}),l=t.story({render:r=>{const{locale:a}=ae();return e.jsx(n,{...r,label:"Working days only",description:"Weekends are unavailable.",isDateUnavailable:i=>E(i,a)})}});d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {}
})`,...d.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Date'
  }
})`,...c.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Date',
    description: 'Select the date of your event.'
  }
})`,...p.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Booking date',
    defaultValue: parseDate('2025-02-03')
  }
})`,...u.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Date'
  },
  render: args => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: 280
  }}>
      <DatePicker {...args} size="small" label="Small" />
      <DatePicker {...args} size="medium" label="Medium" />
    </div>
})`,...m.input.parameters?.docs?.source}}};b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Trip date',
    isRequired: true
  },
  render: args => <Form onSubmit={e => {
    e.preventDefault();
  }} style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: 280
  }}>
      <DatePicker {...args} />
      <Button type="submit">Submit</Button>
    </Form>
})`,...b.input.parameters?.docs?.source}}};f.input.parameters={...f.input.parameters,docs:{...f.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Date',
    isDisabled: true,
    defaultValue: parseDate('2025-03-01')
  }
})`,...f.input.parameters?.docs?.source}}};D.input.parameters={...D.input.parameters,docs:{...D.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Date',
    isInvalid: true,
    errorMessage: 'The selected date is not available.',
    defaultValue: parseDate('2025-04-01')
  }
})`,...D.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    label: 'Date',
    description: 'You can only select dates within the next 30 days.',
    minValue: today(getLocalTimeZone()),
    maxValue: today(getLocalTimeZone()).add({
      days: 30
    })
  }
})`,...g.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
  render: args => {
    const {
      locale
    } = useLocale();
    return <DatePicker {...args} label="Working days only" description="Weekends are unavailable." isDateUnavailable={date => isWeekend(date, locale)} />;
  }
})`,...l.input.parameters?.docs?.source},description:{story:"Weekends are marked unavailable and cannot be selected.",...l.input.parameters?.docs?.description}}};const ea=["Default","WithLabel","WithDescription","WithDefaultValue","Sizes","Required","Disabled","Invalid","WithMinMaxValue","WithUnavailableDates"];export{d as Default,f as Disabled,D as Invalid,b as Required,m as Sizes,u as WithDefaultValue,p as WithDescription,c as WithLabel,g as WithMinMaxValue,l as WithUnavailableDates,ea as __namedExportsOrder};
