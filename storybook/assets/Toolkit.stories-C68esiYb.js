import{j as o}from"./iframe-DCoYcZLi.js";import{c as e}from"./plugin-Cy-L2iFb.js";import{S as l}from"./Grid-D58TNpxw.js";import{C as m}from"./ComponentAccordion-Dx6EQoqr.js";import{w as a}from"./appWrappers-bScNmkAy.js";import{T as i}from"./TemplateBackstageLogoIcon-Cx0DYmFY.js";import{I as s}from"./InfoCard-jQMy2gNa.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-CPv3ynDX.js";import"./componentData-OraWGl32.js";import"./useAnalytics-DTSsXZrs.js";import"./useApp-B6U5E67n.js";import"./useRouteRef-D7QjhLBn.js";import"./index-CZ9gZJRb.js";import"./DialogTitle-CfF7TlGp.js";import"./Modal-CPACyKe7.js";import"./Portal-CFcI6CIt.js";import"./Backdrop-BzZC6sIJ.js";import"./Button-Cp5oCkaD.js";import"./useObservable-CYrlA7wL.js";import"./useIsomorphicLayoutEffect-ByWXU8SB.js";import"./ExpandMore-BjerwzBY.js";import"./AccordionDetails-D0-Ip2Ry.js";import"./index-B9sM2jn7.js";import"./Collapse-K2usbj1G.js";import"./useAsync-BaVFaK6n.js";import"./useMountedState-CnGoVtA3.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-BVxN23xK.js";import"./ErrorBoundary-CrlGkNeT.js";import"./ErrorPanel-D9pajOJW.js";import"./WarningPanel-2R8Y_I4d.js";import"./MarkdownContent-B24-9cF1.js";import"./CodeSnippet-BoQ2ohjZ.js";import"./Box-DX2D8BTJ.js";import"./styled-h2gldWYB.js";import"./CopyTextButton-Crh7sKVk.js";import"./useCopyToClipboard-Ceo0QToL.js";import"./Tooltip-B4Ob7Xca.js";import"./Popper-DRIxTtO6.js";import"./List-BdybXaA2.js";import"./ListContext-DkVKA3j4.js";import"./ListItem-DlFYWpXw.js";import"./ListItemText-BwT95NDX.js";import"./LinkButton-DC4rMSam.js";import"./Link-BB_0S9nF.js";import"./lodash-Czox7iJy.js";import"./CardHeader-B32gDeY8.js";import"./Divider-Ca-0TjsJ.js";import"./CardActions-BhlKSozU.js";import"./BottomLink-DKSFJeM5.js";import"./ArrowForward-BR9xJcBP.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  return <Grid item xs={12} md={6}>
      <HomePageToolkit tools={Array(8).fill({
      url: '#',
      label: 'link',
      icon: <TemplateBackstageLogoIcon />
    })} />
    </Grid>;
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
  const ExpandedComponentAccordion = (props: any) => <ComponentAccordion expanded {...props} />;
  return <InfoCard title="Toolkit" noPadding>
      <Grid item>
        <HomePageToolkit title="Tools 1" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ExpandedComponentAccordion} />
        <HomePageToolkit title="Tools 2" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ComponentAccordion} />
        <HomePageToolkit title="Tools 3" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ComponentAccordion} />
      </Grid>
    </InfoCard>;
}`,...t.parameters?.docs?.source}}};const uo=["Default","InAccordion"];export{r as Default,t as InAccordion,uo as __namedExportsOrder,co as default};
