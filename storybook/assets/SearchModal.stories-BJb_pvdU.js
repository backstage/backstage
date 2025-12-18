import{j as t,m as d,I as u,b as h,T as g}from"./iframe-BY8lR-L8.js";import{r as x}from"./plugin-opx4upFJ.js";import{S as m,u as n,a as S}from"./useSearchModal-EeGlW2B-.js";import{B as c}from"./Button-DOtnJgPP.js";import{a as f,b as M,c as j}from"./DialogTitle-DJH-tFiF.js";import{B as C}from"./Box-COui6GIh.js";import{S as r}from"./Grid-BjrJvsR3.js";import{S as y}from"./SearchType-CosE5ZcB.js";import{L as I}from"./List-Zd71n2FM.js";import{H as R}from"./DefaultResultListItem-D6Ndr7GO.js";import{s as B,M as D}from"./api-ZUH36i94.js";import{S as T}from"./SearchContext-PkY0VTIp.js";import{w as k}from"./appWrappers-CwbFz284.js";import{SearchBar as v}from"./SearchBar-v1FoinlP.js";import{a as b}from"./SearchResult-CXTLyLju.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BWkWUfDc.js";import"./Plugin-pD8p1KrB.js";import"./componentData-UKDdzeuB.js";import"./useAnalytics-BVxeCBFY.js";import"./useApp-BvPEffuf.js";import"./useRouteRef-X5r9b_hf.js";import"./index-BS6rRTnv.js";import"./ArrowForward-BmZGDfYA.js";import"./translation-C4a__HRE.js";import"./Page-oy0Z3Ain.js";import"./useMediaQuery-DyfB6pyL.js";import"./Divider-C9c6KGoD.js";import"./ArrowBackIos-DOf7Kowp.js";import"./ArrowForwardIos-BOgHRpuj.js";import"./translation-zmJ2Lycf.js";import"./Modal-ob7ZinQq.js";import"./Portal-9M61fEx6.js";import"./Backdrop-NlvjxJvh.js";import"./styled-Ckl9NdN2.js";import"./ExpandMore-fkHecgaQ.js";import"./useAsync-DNLOGNju.js";import"./useMountedState-DwTRr6Bf.js";import"./AccordionDetails-Fks5AbbD.js";import"./index-B9sM2jn7.js";import"./Collapse-B6v7_Lug.js";import"./ListItem-CGZ3ypeU.js";import"./ListContext-CBZm9pJe.js";import"./ListItemIcon-BUUsm_I5.js";import"./ListItemText-BFb2Grym.js";import"./Tabs-uBXG9BGx.js";import"./KeyboardArrowRight-DMkibHBi.js";import"./FormLabel-BTmno_qp.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-DQzfReps.js";import"./InputLabel-C_1lyP9G.js";import"./Select-D8Je2o65.js";import"./Popover-C5Oe9S6O.js";import"./MenuItem-j4N1CzUe.js";import"./Checkbox-1pjU2CIe.js";import"./SwitchBase-CnsDPG4Q.js";import"./Chip-DFDuSRb0.js";import"./Link-CG56jGaN.js";import"./lodash-Y_-RFQgK.js";import"./useObservable-DjQNHeFS.js";import"./useIsomorphicLayoutEffect-4IAuBrOv.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-BaKVEMv7.js";import"./useDebounce-Bi-HDdpO.js";import"./InputAdornment-C5fbUJcy.js";import"./TextField-CmNjY28o.js";import"./useElementFilter-CqXfM3jD.js";import"./EmptyState-Bu-XDaU-.js";import"./Progress-CRwW-NBP.js";import"./LinearProgress-RnbnNz5Q.js";import"./ResponseErrorPanel-BpiroY2h.js";import"./ErrorPanel-DUhzHP9c.js";import"./WarningPanel-wg4n1CXF.js";import"./MarkdownContent-CEOHELvX.js";import"./CodeSnippet-ajdkoRYg.js";import"./CopyTextButton-HjsOaOKI.js";import"./useCopyToClipboard-Bl5GfTuC.js";import"./Tooltip-CQzh8PM4.js";import"./Popper-CAf4oxXD.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},ao={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
}`,...i.parameters?.docs?.source}}};const lo=["Default","CustomModal"];export{i as CustomModal,s as Default,lo as __namedExportsOrder,ao as default};
