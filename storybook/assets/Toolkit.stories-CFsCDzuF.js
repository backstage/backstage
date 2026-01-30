import{j as o}from"./iframe-Dc6SVWG5.js";import{c as e}from"./plugin-BlGK1-aG.js";import{S as l}from"./Grid-BSXyf9SS.js";import{C as m}from"./ComponentAccordion-DT8ZaoyT.js";import{w as a}from"./appWrappers-BS_aK2if.js";import{T as i}from"./TemplateBackstageLogoIcon-C3n8uubB.js";import{I as s}from"./InfoCard-D2Dsw8kY.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-Bqo592_1.js";import"./componentData-B8Jq35jm.js";import"./useAnalytics-BxYnHleN.js";import"./useApp-B6m3gjBm.js";import"./useRouteRef-ntEBWiMC.js";import"./index-8XuG-gel.js";import"./DialogTitle-Blj5CnhU.js";import"./Modal-DUt8H3ab.js";import"./Portal-COm53pHi.js";import"./Backdrop-DWd11VkA.js";import"./Button-CRU2KsP0.js";import"./useObservable-BhSXlvnh.js";import"./useIsomorphicLayoutEffect-4X9BfDi_.js";import"./ExpandMore-DbnKJ-3Y.js";import"./AccordionDetails-CK24iBmJ.js";import"./index-B9sM2jn7.js";import"./Collapse-5pSFEBGG.js";import"./useAsync-BGeZ5faP.js";import"./useMountedState-1x78q3TT.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-BBDXdNq6.js";import"./ErrorBoundary-DNl5LSbb.js";import"./ErrorPanel-D-ezxJ4v.js";import"./WarningPanel-C3dDiuJG.js";import"./MarkdownContent-B1WuysOW.js";import"./CodeSnippet-BullD9eL.js";import"./Box-DORcO5nL.js";import"./styled-Dq5lPzbL.js";import"./CopyTextButton-B-mnnb3d.js";import"./useCopyToClipboard-CBsscp3Q.js";import"./Tooltip-C8OYhGnh.js";import"./Popper-CJ7TZbcE.js";import"./List-CqEwDLab.js";import"./ListContext-CQwj8Qg7.js";import"./ListItem-BhueXXFi.js";import"./ListItemText-BD21enaM.js";import"./LinkButton-BpB7BUZ5.js";import"./Link-CiS0SEiJ.js";import"./lodash-Czox7iJy.js";import"./CardHeader-WVbEoKUm.js";import"./Divider-B6Rq6sfT.js";import"./CardActions-B8JlOWcD.js";import"./BottomLink-CKkdm6Qn.js";import"./ArrowForward-CnwzCGwZ.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
