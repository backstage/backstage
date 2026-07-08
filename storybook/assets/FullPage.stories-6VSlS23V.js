import{bg as b,ca as x,cH as P,bR as e,c7 as f,w as y}from"./iframe-DUP7Kr9f.js";import{P as l}from"./PluginHeader-BZQpEwyk.js";import{C as p}from"./Container-B8JQTaNe.js";import{T as t}from"./Text-mBs9eAlr.js";import{B as j}from"./BUIProvider-DIP20PR9.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Dk7fxhAf.js";import"./utils-OsyFBnTM.js";import"./useObjectRef-BVJl6YFP.js";import"./useCollection-BGt70NGl.js";import"./useFocusRing-B1eaMwrg.js";import"./openLink-CpcL-pAy.js";import"./Hidden-DFXJQe4O.js";import"./keyboard-wyu31WpW.js";import"./FocusScope-BOXiKyWz.js";import"./useEvent-HTZxTeYo.js";import"./I18nProvider-ByGA4yZu.js";import"./usePress-CBZTJU3x.js";import"./textSelection-Dy2q-sAc.js";import"./useControlledState-DtDFdZyB.js";import"./Link-BhTFFHFR.js";import"./useLink-qgmR8khF.js";import"./useHover-D-kET7Yv.js";import"./useLocalizedStringFormatter-BVbfSq6O.js";import"./Button-xMTzeFHr.js";import"./Label-BWr9MvjN.js";import"./useLabel-9tsjfF-g.js";import"./useLabels-BZeNsKrn.js";import"./number-BPPv7Ioc.js";import"./useButton-BpH5atl_.js";import"./Menu-CKB7jrls.js";import"./Autocomplete-UXx75M8g.js";import"./getItemCount-c6AcdID-.js";import"./Input-DwlhOTjU.js";import"./ListBox-BG7j6RmA.js";import"./Text-CTeL5G12.js";import"./useListState-DaHMSHEC.js";import"./Dialog-CbkhRwKg.js";import"./Heading-BuRbHD2O.js";import"./useOverlayTriggerState-BDxCsQwJ.js";import"./VisuallyHidden-C-qe1bQM.js";import"./animation-DvaI1_gU.js";import"./SearchField-D55vrjzY.js";import"./FieldError-DN_xcTzW.js";import"./useFormValidation-wMuOtWAb.js";import"./useTextField-LhEkeYiB.js";import"./useField-CuB1pXJt.js";import"./useFormReset-BlbVtN_H.js";import"./Virtualizer-DVw4Osts.js";import"./useFilter-DKcqFvj2.js";import"./getNodeText-VNhldOYX.js";import"./Link-DloQypsG.js";import"./useResolvedHref-DMqfeb_z.js";import"./Tooltip-Bl60t-ot.js";import"./VisuallyHidden-DyUXDF97.js";import"./Tabs-CHdoDiYk.js";import"./useHasTabbableChild-B_PlkjVT.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=b()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=x.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

The FullPage component consumes the \`--bui-header-height\` CSS custom property
set by the Header component to calculate its height as
\`calc(100dvh - var(--bui-header-height, 0px))\`. Content inside the FullPage
scrolls independently while the Header stays visible.

@public`,methods:[],displayName:"FullPage",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const m=f.meta({title:"Backstage UI/FullPage",component:r,parameters:{layout:"fullscreen"}}),c=i=>e.jsx(y,{children:e.jsx(j,{children:e.jsx(i,{})})}),F=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"}],u=Array.from({length:20},(i,n)=>e.jsx(t,{as:"p",children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},n)),o=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{style:{backgroundColor:"#c3f0ff"},children:e.jsx(p,{children:e.jsx(t,{as:"p",children:"This content fills the remaining viewport height below the Header."})})})]})}),a=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"h2",variant:"title-medium",children:"Scrollable Content"}),e.jsx(t,{as:"p",children:"The content below scrolls independently while the Header stays pinned at the top."}),u]})})]})}),s=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin",tabs:F}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"p",children:"The FullPage height adjusts automatically when the Header includes tabs, thanks to the ResizeObserver measuring the Header's actual height."}),u]})})]})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <PluginHeader title="My Plugin" />
      <FullPage style={{
      backgroundColor: '#c3f0ff'
    }}>
        <Container>
          <Text as="p">
            This content fills the remaining viewport height below the Header.
          </Text>
        </Container>
      </FullPage>
    </>
})`,...o.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <PluginHeader title="My Plugin" />
      <FullPage>
        <Container>
          <Text as="h2" variant="title-medium">
            Scrollable Content
          </Text>
          <Text as="p">
            The content below scrolls independently while the Header stays
            pinned at the top.
          </Text>
          {paragraphs}
        </Container>
      </FullPage>
    </>
})`,...a.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <PluginHeader title="My Plugin" tabs={tabs} />
      <FullPage>
        <Container>
          <Text as="p">
            The FullPage height adjusts automatically when the Header includes
            tabs, thanks to the ResizeObserver measuring the Header's actual
            height.
          </Text>
          {paragraphs}
        </Container>
      </FullPage>
    </>
})`,...s.input.parameters?.docs?.source}}};const ke=["Default","WithScrollableContent","WithTabs"];export{o as Default,a as WithScrollableContent,s as WithTabs,ke as __namedExportsOrder};
