import{be as y,cE as P,bQ as e,c8 as C,c5 as V}from"./iframe-DFSHFeCl.js";import{a as I,$ as R,i as T,d as q,c as F,g as H,h as G,e as M,n as E,b as h,l as j,k as N,j as A}from"./DatePicker-2pmmxU2Z.js";import{b as x}from"./Button-CHnTR83Q.js";import{$ as U}from"./Input-CC8yKmPI.js";import{R as O,J,F as Y}from"./index-BHTbnh3H.js";import{$ as Z}from"./Heading-CAtJlgMr.js";import{F as Q}from"./FieldLabel-D_HNdCVZ.js";import{F as K}from"./FieldError-Dbox7jPP.js";import{P as X}from"./Popover-D2uGfJYi.js";import{a as ee}from"./useFormValidation-Dlp-ns6i.js";import{$ as ae}from"./I18nProvider-DTAG6ziA.js";import{B as re}from"./Button-CTUbeFQz.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-Br_KD21J.js";import"./useObjectRef-5J7-CqHL.js";import"./Text-CnNdo26s.js";import"./useFocusRing-DK7tnvLa.js";import"./openLink-BDUtlzhT.js";import"./useLocalizedStringFormatter-DIyeRDi1.js";import"./useLabels--neREfox.js";import"./useUpdateEffect-BZ4RmK1d.js";import"./getItemCount-B-1zO-xx.js";import"./useCollection-ugJQXbbG.js";import"./Hidden-Dx45ZTjH.js";import"./keyboard-fFFHaEtw.js";import"./FocusScope-BG-0J7KO.js";import"./useEvent-BwtYMmmR.js";import"./usePress-D5mzPi8R.js";import"./textSelection-Bpfa-ycw.js";import"./useControlledState-CqWOEZ5B.js";import"./useHover-DTeONGMq.js";import"./VisuallyHidden-C2SMEw2G.js";import"./useField-yItrfdEq.js";import"./useLabel-DvxVy_uj.js";import"./useFormReset-C38yIenU.js";import"./useFilter-p_ans4Za.js";import"./useSpinButton-FctMRIQd.js";import"./number-UEiGF2v3.js";import"./Dialog-BIsC4Zx2.js";import"./useOverlayTriggerState-DzKGkFGl.js";import"./Autocomplete-ERpxxjwQ.js";import"./animation-BdzC1IqV.js";import"./FieldError-BPsmoLqs.js";import"./Label-5UBRWhey.js";import"./useButton-RXc6MuTs.js";const $={"bui-DatePicker":"_bui-DatePicker_pev5p_24","bui-DatePickerGroup":"_bui-DatePickerGroup_pev5p_36","bui-DatePickerButton":"_bui-DatePickerButton_pev5p_87","bui-DatePickerDateInput":"_bui-DatePickerDateInput_pev5p_98","bui-DatePickerSegment":"_bui-DatePickerSegment_pev5p_118","bui-DatePickerCalendar":"_bui-DatePickerCalendar_pev5p_193","bui-DatePickerCalendarHeader":"_bui-DatePickerCalendarHeader_pev5p_198","bui-DatePickerCalendarHeading":"_bui-DatePickerCalendarHeading_pev5p_205","bui-DatePickerCalendarNavButton":"_bui-DatePickerCalendarNavButton_pev5p_215","bui-DatePickerCalendarGrid":"_bui-DatePickerCalendarGrid_pev5p_248","bui-DatePickerCalendarHeaderCell":"_bui-DatePickerCalendarHeaderCell_pev5p_254","bui-DatePickerCalendarCell":"_bui-DatePickerCalendarCell_pev5p_268"},te=y()({styles:$,classNames:{root:"bui-DatePicker"},propDefs:{size:{dataAttribute:!0,default:"small"},className:{},label:{},description:{},secondaryLabel:{}}}),ie=y()({styles:$,classNames:{root:"bui-DatePickerGroup",dateInput:"bui-DatePickerDateInput",segment:"bui-DatePickerSegment",button:"bui-DatePickerButton"},bg:"consumer",propDefs:{}}),se=y()({styles:$,classNames:{root:"bui-DatePickerCalendar",header:"bui-DatePickerCalendarHeader",heading:"bui-DatePickerCalendarHeading",navButton:"bui-DatePickerCalendarNavButton",grid:"bui-DatePickerCalendarGrid",gridHeader:"bui-DatePickerCalendarGridHeader",headerCell:"bui-DatePickerCalendarHeaderCell",gridBody:"bui-DatePickerCalendarGridBody",cell:"bui-DatePickerCalendarCell"},propDefs:{}}),w=({dataSize:r})=>{const{ownProps:a,dataAttributes:i}=P(ie,{}),{classes:s}=a;return e.jsxs(U,{className:s.root,...i,...r?{"data-size":r}:{},children:[e.jsx(I,{className:s.dateInput,children:o=>e.jsx(R,{segment:o,className:s.segment})}),e.jsx(x,{className:s.button,"aria-label":"Open calendar",children:e.jsx(O,{size:16,"aria-hidden":"true"})})]})};w.__docgenInfo={description:`Custom field group for DatePicker — renders a single DateInput field
and a calendar trigger button.

@internal`,methods:[],displayName:"DatePickerGroup",props:{dataSize:{required:!1,tsType:{name:"string"},description:""}}};const S=()=>{const{ownProps:r}=P(se,{}),{classes:a}=r;return e.jsxs(T,{className:a.root,children:[e.jsxs("header",{className:a.header,children:[e.jsx(x,{slot:"previous",className:a.navButton,children:e.jsx(J,{size:16,"aria-hidden":"true"})}),e.jsx(Z,{className:a.heading}),e.jsx(x,{slot:"next",className:a.navButton,children:e.jsx(Y,{size:16,"aria-hidden":"true"})})]}),e.jsxs(q,{className:a.grid,children:[e.jsx(F,{className:a.gridHeader,children:i=>e.jsx(H,{className:a.headerCell,children:i})}),e.jsx(G,{className:a.gridBody,children:i=>e.jsx(M,{className:a.cell,date:i})})]})]})};S.__docgenInfo={description:`Calendar popover content for DatePicker — renders the Calendar with
navigation and a full calendar grid.

@internal`,methods:[],displayName:"DatePickerCalendar"};const n=C.forwardRef((r,a)=>{const{ownProps:i,restProps:s,dataAttributes:o}=P(te,r),{classes:B,label:k,description:L,secondaryLabel:W}=i,v=s["aria-label"],_=s["aria-labelledby"];C.useEffect(()=>{!k&&!v&&!_&&console.warn("DatePicker requires either a visible label, aria-label, or aria-labelledby for accessibility")},[k,v,_]);const z=W||(s.isRequired?"Required":null);return e.jsxs(E,{className:B.root,...o,...s,ref:a,children:[e.jsx(Q,{label:k,secondaryLabel:z,description:L,descriptionSlot:"description"}),e.jsx(w,{dataSize:o["data-size"]}),e.jsx(K,{}),e.jsx(X,{hideArrow:!0,children:e.jsx(S,{})})]})});n.displayName="DatePicker";n.__docgenInfo={description:`A date picker that combines a date field and a calendar popover, allowing
users to enter or select a date with full keyboard and screen reader
accessibility.

@public`,methods:[],displayName:"DatePicker",props:{size:{required:!1,tsType:{name:"union",raw:"'small' | 'medium' | Partial<Record<Breakpoint, 'small' | 'medium'>>",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]}],raw:"Record<Breakpoint, 'small' | 'medium'>"}],raw:"Partial<Record<Breakpoint, 'small' | 'medium'>>"}]},description:`The size of the date picker
@defaultValue 'small'`},className:{required:!1,tsType:{name:"string"},description:""},label:{required:!1,tsType:{name:"FieldLabelProps['label']",raw:"FieldLabelProps['label']"},description:""},description:{required:!1,tsType:{name:"FieldLabelProps['description']",raw:"FieldLabelProps['description']"},description:""},secondaryLabel:{required:!1,tsType:{name:"FieldLabelProps['secondaryLabel']",raw:"FieldLabelProps['secondaryLabel']"},description:""}},composes:["Omit"]};const t=V.meta({title:"Backstage UI/DatePicker",component:n,args:{style:{width:280}}}),d=t.story({args:{}}),c=t.story({args:{label:"Date"}}),p=t.story({args:{label:"Date",description:"Select the date of your event."}}),u=t.story({args:{label:"Booking date",defaultValue:h("2025-02-03")}}),m=t.story({args:{label:"Date"},render:r=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem",width:280},children:[e.jsx(n,{...r,size:"small",label:"Small"}),e.jsx(n,{...r,size:"medium",label:"Medium"})]})}),b=t.story({args:{label:"Trip date",isRequired:!0},render:r=>e.jsxs(ee,{onSubmit:a=>{a.preventDefault()},style:{display:"flex",flexDirection:"column",gap:"1rem",width:280},children:[e.jsx(n,{...r}),e.jsx(re,{type:"submit",children:"Submit"})]})}),f=t.story({args:{label:"Date",isDisabled:!0,defaultValue:h("2025-03-01")}}),D=t.story({args:{label:"Date",isInvalid:!0,errorMessage:"The selected date is not available.",defaultValue:h("2025-04-01")}}),g=t.story({args:{label:"Date",description:"You can only select dates within the next 30 days.",minValue:j(N()),maxValue:j(N()).add({days:30})}}),l=t.story({render:r=>{const{locale:a}=ae();return e.jsx(n,{...r,label:"Working days only",description:"Weekends are unavailable.",isDateUnavailable:i=>A(i,a)})}});d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...l.input.parameters?.docs?.source},description:{story:"Weekends are marked unavailable and cannot be selected.",...l.input.parameters?.docs?.description}}};const Qe=["Default","WithLabel","WithDescription","WithDefaultValue","Sizes","Required","Disabled","Invalid","WithMinMaxValue","WithUnavailableDates"];export{d as Default,f as Disabled,D as Invalid,b as Required,m as Sizes,u as WithDefaultValue,p as WithDescription,c as WithLabel,g as WithMinMaxValue,l as WithUnavailableDates,Qe as __namedExportsOrder};
