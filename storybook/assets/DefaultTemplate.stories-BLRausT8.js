import{j as t,U as p,V as c,W as l,m as i,a0 as d}from"./iframe-Dc6SVWG5.js";import{s as g,H as u}from"./plugin-DycAObjD.js";import{c as h}from"./api-ePt3vR2x.js";import{c as f}from"./catalogApiMock-G4ItrbDo.js";import{s as x}from"./api-BxqHLxfN.js";import{S as y}from"./SearchContext-DqrUnkbo.js";import{P as S}from"./Page-C4OWdnPB.js";import{S as r}from"./Grid-BSXyf9SS.js";import{b as k,a as j,c as C}from"./plugin-BlGK1-aG.js";import{T as P}from"./TemplateBackstageLogo-CdQu_cYd.js";import{T as I}from"./TemplateBackstageLogoIcon-C3n8uubB.js";import{e as T}from"./routes-B9kRB7uR.js";import{w as v}from"./appWrappers-BS_aK2if.js";import{s as G}from"./StarredEntitiesApi-DArP7iTS.js";import{M as A}from"./MockStarredEntitiesApi-C6Hcqqg4.js";import{I as B}from"./InfoCard-D2Dsw8kY.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BMfFXY5k.js";import"./Plugin-Bqo592_1.js";import"./componentData-B8Jq35jm.js";import"./useAnalytics-BxYnHleN.js";import"./useApp-B6m3gjBm.js";import"./useRouteRef-ntEBWiMC.js";import"./index-8XuG-gel.js";import"./ref-C0VTUPuL.js";import"./lodash-Czox7iJy.js";import"./useAsync-BGeZ5faP.js";import"./useMountedState-1x78q3TT.js";import"./DialogTitle-Blj5CnhU.js";import"./Modal-DUt8H3ab.js";import"./Portal-COm53pHi.js";import"./Backdrop-DWd11VkA.js";import"./Button-CRU2KsP0.js";import"./useObservable-BhSXlvnh.js";import"./useIsomorphicLayoutEffect-4X9BfDi_.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-BBDXdNq6.js";import"./ErrorBoundary-DNl5LSbb.js";import"./ErrorPanel-D-ezxJ4v.js";import"./WarningPanel-C3dDiuJG.js";import"./ExpandMore-DbnKJ-3Y.js";import"./AccordionDetails-CK24iBmJ.js";import"./index-B9sM2jn7.js";import"./Collapse-5pSFEBGG.js";import"./MarkdownContent-B1WuysOW.js";import"./CodeSnippet-BullD9eL.js";import"./Box-DORcO5nL.js";import"./styled-Dq5lPzbL.js";import"./CopyTextButton-B-mnnb3d.js";import"./useCopyToClipboard-CBsscp3Q.js";import"./Tooltip-C8OYhGnh.js";import"./Popper-CJ7TZbcE.js";import"./List-CqEwDLab.js";import"./ListContext-CQwj8Qg7.js";import"./ListItem-BhueXXFi.js";import"./ListItemText-BD21enaM.js";import"./LinkButton-BpB7BUZ5.js";import"./Link-CiS0SEiJ.js";import"./CardHeader-WVbEoKUm.js";import"./Divider-B6Rq6sfT.js";import"./CardActions-B8JlOWcD.js";import"./BottomLink-CKkdm6Qn.js";import"./ArrowForward-CnwzCGwZ.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Ft={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":T}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(I,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    svg,
    path,
    container
  } = useLogoStyles();
  return <SearchContextProvider>
      <Page themeId="home">
        <Content>
          <Grid container justifyContent="center" spacing={6}>
            <HomePageCompanyLogo className={container} logo={<TemplateBackstageLogo classes={{
            svg,
            path
          }} />} />
            <Grid container item xs={12} justifyContent="center">
              <HomePageSearchBar InputProps={{
              classes: {
                root: classes.searchBarInput,
                notchedOutline: classes.searchBarOutline
              }
            }} placeholder="Search" />
            </Grid>
            <Grid container item xs={12}>
              <Grid item xs={12} md={6}>
                <HomePageStarredEntities />
              </Grid>
              <Grid item xs={12} md={6}>
                <HomePageToolkit tools={Array(8).fill({
                url: '#',
                label: 'link',
                icon: <TemplateBackstageLogoIcon />
              })} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoCard title="Composable Section">
                  {/* placeholder for content */}
                  <div style={{
                  height: 370
                }} />
                </InfoCard>
              </Grid>
            </Grid>
          </Grid>
        </Content>
      </Page>
    </SearchContextProvider>;
}`,...o.parameters?.docs?.source}}};const zt=["DefaultTemplate"];export{o as DefaultTemplate,zt as __namedExportsOrder,Ft as default};
