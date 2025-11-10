import{j as t,m as d,I as u,b as h,T as g}from"./iframe-Dg7jNfgV.js";import{r as x}from"./plugin-CNPokr64.js";import{S as m,u as n,a as S}from"./useSearchModal-Cnoonglp.js";import{B as c}from"./Button-CrARaf08.js";import{a as f,b as M,c as j}from"./DialogTitle-BGuqEob6.js";import{B as C}from"./Box-Bmqbh7u4.js";import{S as r}from"./Grid-DZoxUphm.js";import{S as y}from"./SearchType-BXLLLq2A.js";import{L as I}from"./List-CB5Cl-bM.js";import{H as R}from"./DefaultResultListItem-BXH9FoIy.js";import{s as B,M as D}from"./api-CU8DSyC9.js";import{S as T}from"./SearchContext-C2hMOi4s.js";import{w as k}from"./appWrappers-Dhyq66xu.js";import{SearchBar as v}from"./SearchBar-yRv4Hepj.js";import{a as b}from"./SearchResult-CDkC5fsm.js";import"./preload-helper-D9Z9MdNV.js";import"./index-DHdHtyHw.js";import"./Plugin-G9-uH3UY.js";import"./componentData-CzpKGprp.js";import"./useAnalytics-DDAI3Sby.js";import"./useApp-DBejBM5d.js";import"./useRouteRef-BE4yvNyY.js";import"./index-DJhhhiwK.js";import"./ArrowForward-B5pYWWYy.js";import"./translation-BmVBirsD.js";import"./Page-CjhVM5cD.js";import"./useMediaQuery-DpVjFp9_.js";import"./Divider-ithO4Mrh.js";import"./ArrowBackIos-16DuYlNr.js";import"./ArrowForwardIos-_i6m-S0a.js";import"./translation-smd35myr.js";import"./Modal-CaeBjbT7.js";import"./Portal-DaCRxhVb.js";import"./Backdrop-INLhdtBn.js";import"./styled-CMe42Sps.js";import"./ExpandMore-B7ltQ0WG.js";import"./useAsync-DkNvCakU.js";import"./useMountedState-6AheAbGL.js";import"./AccordionDetails-CFRyv9zh.js";import"./index-DnL3XN75.js";import"./Collapse-BXYqoVfQ.js";import"./ListItem-WexTgdCu.js";import"./ListContext-DjmviigF.js";import"./ListItemIcon-D6-_4h2Y.js";import"./ListItemText-DJB03TAT.js";import"./Tabs-DoahHFWd.js";import"./KeyboardArrowRight-DfFobFP8.js";import"./FormLabel-BeJBp0CO.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CmqbUbAp.js";import"./InputLabel-CXLmwbDB.js";import"./Select-Dbf0pSrJ.js";import"./Popover-BRFYuyYy.js";import"./MenuItem-BWCz3K9l.js";import"./Checkbox-C-eunBv1.js";import"./SwitchBase-Da9dUX43.js";import"./Chip-ArAw-rI4.js";import"./Link-gNdToM-H.js";import"./lodash-CwBbdt2Q.js";import"./useObservable-BZnIpjCU.js";import"./useIsomorphicLayoutEffect-BlM3Hzgi.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./Search-Cq_4db2p.js";import"./useDebounce-HAnfv4QK.js";import"./InputAdornment-DrP_j510.js";import"./TextField-B_qhexU1.js";import"./useElementFilter-BTTrnlJy.js";import"./EmptyState-CLhCl-Qz.js";import"./Progress-DjezaQkc.js";import"./LinearProgress-jzzSe_jD.js";import"./ResponseErrorPanel-CL8L0UCa.js";import"./ErrorPanel-CFu8Rfin.js";import"./WarningPanel-D2enhZvg.js";import"./MarkdownContent-XjtKEh5y.js";import"./CodeSnippet-DJ-lPCL_.js";import"./CopyTextButton-CNGlDDM9.js";import"./useCopyToClipboard-CoeOzktD.js";import"./Tooltip-hjut9A6-.js";import"./Popper-DfjHoTPM.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},ao={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
