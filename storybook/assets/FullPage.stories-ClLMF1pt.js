import{aO as x,r as b,aP as P,j as e,p as f,M as y}from"./iframe-DsaViRt6.js";import{P as l}from"./PluginHeader-DWmPiPXt.js";import{C as p}from"./Container-BQF2Uu-p.js";import{T as t}from"./Text-CL9Rzloh.js";import{B as j}from"./BUIProvider-CSv_q2aR.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B0Q9OrQR.js";import"./utils-BMtDQ3Mp.js";import"./useObjectRef-C8p51AiY.js";import"./useCollection-Cs0xDMvq.js";import"./useFocusRing-BGqp868t.js";import"./openLink-DOqnQA7B.js";import"./Hidden-D546-sk9.js";import"./keyboard-uKxI18m4.js";import"./FocusScope-CR9tPNWo.js";import"./useEvent-gqYo67_a.js";import"./I18nProvider-C_4m3VHk.js";import"./usePress-DMXgY0oY.js";import"./textSelection-8YvAK-Rq.js";import"./useControlledState-C9PUVjXY.js";import"./Link-BJcIW4hw.js";import"./useLink-BXqpXIpj.js";import"./useHover-DqXkt4DH.js";import"./useLocalizedStringFormatter-Dhnzadev.js";import"./Button-S9X553hq.js";import"./Label-BVmI6bof.js";import"./useLabel-yKsWsykb.js";import"./useLabels-DdirUbZa.js";import"./number-DJMv4vuV.js";import"./useButton-Tyy1zmtL.js";import"./Menu-Dyu8ce1U.js";import"./Autocomplete-I0IZMQ4E.js";import"./getItemCount-B7fxe3k-.js";import"./Input-0kUbtdsi.js";import"./ListBox-sjCYFeen.js";import"./Text-GoRNm5GP.js";import"./useListState-Gx-EzyDz.js";import"./Dialog-D8aXriuN.js";import"./Heading-DAe5mcha.js";import"./useOverlayTriggerState-AJWVqgd9.js";import"./VisuallyHidden-BwUv9CCW.js";import"./animation-BJNMN6_t.js";import"./SearchField-BuWO_BBj.js";import"./FieldError-TG0Riy-r.js";import"./useFormValidation-BtIFnSNg.js";import"./useTextField-CDL3kK35.js";import"./useField-ET5d43gu.js";import"./useFormReset-DkLfLBli.js";import"./Virtualizer-C2Xneja1.js";import"./useFilter-PzttL9Gi.js";import"./getNodeText-CRuIzOmM.js";import"./Link-DopmFt_Q.js";import"./useResolvedHref-BnrY4UN4.js";import"./Tooltip-CsEou8gd.js";import"./VisuallyHidden-BnjhbiiH.js";import"./Tabs-Ceci15cY.js";import"./useHasTabbableChild-DZMwpLn7.js";import"./BUIRoutingProvider-80Q71Qhv.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
})`,...s.input.parameters?.docs?.source}}};const Se=["Default","WithScrollableContent","WithTabs"];export{o as Default,a as WithScrollableContent,s as WithTabs,Se as __namedExportsOrder};
