import{bg as b,ca as x,cH as P,bR as e,c7 as f,w as y}from"./iframe-BErNvpjr.js";import{P as l}from"./PluginHeader-D3FEi59g.js";import{C as p}from"./Container-CfCPfS0u.js";import{T as t}from"./Text-DdtiTKlO.js";import{B as j}from"./BUIProvider-Dq5AuJpk.js";import"./preload-helper-PPVm8Dsz.js";import"./index-9xGCRmTA.js";import"./utils-CkI-fiaI.js";import"./useObjectRef-BTVJqnIZ.js";import"./useCollection-Dnxe7Oy8.js";import"./useFocusRing-DhH0pnm8.js";import"./openLink-VEX9Ze2_.js";import"./Hidden-BXpNp4mY.js";import"./keyboard-ZpJRXcMx.js";import"./FocusScope-CTGfV_ax.js";import"./useEvent-lGzlaYoH.js";import"./I18nProvider-Co2RDX0c.js";import"./usePress-BuVIReZf.js";import"./textSelection-Beclu5dQ.js";import"./useControlledState-DHvityQM.js";import"./Link-BW2x72wM.js";import"./useLink-riZbJjTq.js";import"./useHover-n_zdByGl.js";import"./useLocalizedStringFormatter-zvzfXQUD.js";import"./Button-ZmGKrZ8S.js";import"./Label-CdvKSS9p.js";import"./useLabel-0LCDbxSL.js";import"./useLabels-BfB1Y_Ok.js";import"./number-B7KdHmdZ.js";import"./useButton-CuzCCNla.js";import"./Menu-CJmjhVha.js";import"./Autocomplete-wiZIjKv7.js";import"./getItemCount-B3MHdml6.js";import"./Input-BVdpaGN9.js";import"./ListBox-DtpahCWk.js";import"./Text-m3plxjD3.js";import"./useListState-Ci7FWIUB.js";import"./Dialog-BiSqxIuw.js";import"./Heading-HRif4aHN.js";import"./useOverlayTriggerState-dtDxw6VN.js";import"./VisuallyHidden-Db_hi_Bl.js";import"./animation-vcnj4bnB.js";import"./SearchField-XOxAVTba.js";import"./FieldError-B0J3oIAj.js";import"./useFormValidation-CVK9l0hq.js";import"./useTextField-D2kqKQ27.js";import"./useField-DXkN9cJL.js";import"./useFormReset-1WyntnJY.js";import"./Virtualizer-BO_3TEBD.js";import"./useFilter-BFesSPZp.js";import"./getNodeText-Cokmlwms.js";import"./Link-DYYjGFUh.js";import"./useResolvedHref-D6iP9kLP.js";import"./Tooltip-XMa2Y4y3.js";import"./VisuallyHidden-BhYALDAo.js";import"./Tabs-D8YHD5kh.js";import"./useHasTabbableChild-B_2juTEs.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=b()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=x.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
