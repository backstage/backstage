import{j as t,W as d,a3 as u,a2 as h}from"./iframe-BbcE2xlx.js";import{r as g}from"./plugin-TzhFfzKL.js";import{S as l,u as n,a as x}from"./useSearchModal-BRPYySFO.js";import{B as c}from"./Button-D3ZO0Cbq.js";import{D as S,a as f,b as M}from"./DialogTitle-DiBeSUQL.js";import{B as j}from"./Box-DV7TtJ3X.js";import{S as r}from"./Grid-AQTL701u.js";import{S as C}from"./SearchType-ZMM4-g-V.js";import{L as y}from"./List-Bm-97Bpf.js";import{H as I}from"./DefaultResultListItem-BLqlWtWf.js";import{w as R}from"./appWrappers-B-tavyRT.js";import{m as B}from"./makeStyles-ByEaUd5i.js";import{s as D,M as k}from"./api-BJz4tEba.js";import{S as v}from"./SearchContext-uGq3S4Ct.js";import{SearchBar as T}from"./SearchBar-DEkw7Xg-.js";import{S as b}from"./SearchResult-sgeGf24A.js";import"./preload-helper-PPVm8Dsz.js";import"./index-GeZeet3F.js";import"./Plugin-B6RLq7Rs.js";import"./componentData-DtKArN-5.js";import"./useAnalytics-BQ8kZAPF.js";import"./useApp-lAnrRgXP.js";import"./useRouteRef-CXp2ws_J.js";import"./ArrowForward-C53efLk6.js";import"./translation-DlYKoCiC.js";import"./Page-DSDMmB5w.js";import"./useMediaQuery-CZ9jefxN.js";import"./Divider-DkzbiSpR.js";import"./ArrowBackIos-B5pOy34j.js";import"./ArrowForwardIos-B6C7t3A6.js";import"./translation-VM4jRrbR.js";import"./Modal-BvizGCw9.js";import"./Portal-Dt7280Bv.js";import"./Backdrop-D4Q2djtW.js";import"./styled-CYn__la3.js";import"./ExpandMore-BlT2jwO9.js";import"./useAsync-DL4tyVAS.js";import"./useMountedState-OO1MzqbQ.js";import"./AccordionDetails-r5DmlixB.js";import"./index-B9sM2jn7.js";import"./Collapse-L8V7cMC0.js";import"./ListItem-BurMZ2sa.js";import"./ListContext-D5tjuQRC.js";import"./ListItemIcon-D4nekfNA.js";import"./ListItemText-C2fSQsN6.js";import"./Tabs-D91T6-7O.js";import"./KeyboardArrowRight-3fu4T-am.js";import"./FormLabel-DGn8gfNW.js";import"./formControlState-PyrwHc-I.js";import"./InputLabel-D2nTOgqs.js";import"./Select-D2lspZGc.js";import"./Popover-BjhC_IZb.js";import"./MenuItem-BfROVBkq.js";import"./Checkbox-C1RD8_-U.js";import"./SwitchBase-DnDCAPjS.js";import"./Chip-HAdaLfby.js";import"./Link-IFkxtfSo.js";import"./index-DfiyOdhX.js";import"./lodash--S21zL8B.js";import"./WebStorage-CNsvN6IS.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-D63-PkIF.js";import"./useIsomorphicLayoutEffect-BioijhO_.js";import"./BUIProvider-DTssGubj.js";import"./openLink-20IyJpTm.js";import"./useResolvedHref-CGa-19p5.js";import"./Search-DZ_pd2_b.js";import"./useDebounce-DmzovmuR.js";import"./InputAdornment-CCpEC-dZ.js";import"./TextField-CtH4ChLk.js";import"./useElementFilter-C8tvUDgq.js";import"./EmptyState-D4zmor-4.js";import"./Progress-pqXFVsHJ.js";import"./LinearProgress-bosTNfd9.js";import"./ResponseErrorPanel-Ba99UU3O.js";import"./ErrorPanel-CqTIImcD.js";import"./WarningPanel-xT0w7WLy.js";import"./MarkdownContent-DMHIxffD.js";import"./CodeSnippet-C8m-Ujvi.js";import"./CopyTextButton-DODSIrEV.js";import"./useCopyToClipboard-CYB6N8c9.js";import"./Tooltip-DGQL3ZPr.js";import"./Popper-BWJvOSAM.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},co={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>R(t.jsx(h,{apis:[[D,new k(G)]],children:t.jsx(v,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(l,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(T,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(y,{children:p.map(({document:m})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(I,{result:m},m.location)},`${m.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>;
}`,...i.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs defaultValue="" types={[{
                value: 'custom-result-item',
                name: 'Custom Item'
              }, {
                value: 'no-custom-result-item',
                name: 'No Custom Item'
              }]} />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({
                  results
                }) => <List>
                        {results.map(({
                    document
                  }) => <div role="button" tabIndex={0} key={\`\${document.location}-btn\`} onClick={toggleModal} onKeyPress={toggleModal}>
                            <DefaultResultListItem key={document.location} result={document} />
                          </div>)}
                      </List>}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>}
      </SearchModal>
    </>;
}`,...s.parameters?.docs?.source}}};const po=["Default","CustomModal"];export{s as CustomModal,i as Default,po as __namedExportsOrder,co as default};
