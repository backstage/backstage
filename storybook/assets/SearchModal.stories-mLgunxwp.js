import{j as t,m as d,I as u,b as h,T as g}from"./iframe-Dyaavudc.js";import{r as x}from"./plugin-DyqVdNkd.js";import{S as m,u as n,a as S}from"./useSearchModal-4Mc47X_6.js";import{B as c}from"./Button-p78_XACY.js";import{a as f,b as M,c as j}from"./DialogTitle-BgPww_-x.js";import{B as C}from"./Box-BBMZCdvE.js";import{S as r}from"./Grid-yjQsuTcw.js";import{S as y}from"./SearchType-CjACsY8F.js";import{L as I}from"./List-CD5TLS8H.js";import{H as R}from"./DefaultResultListItem-BhLqDxrd.js";import{s as B,M as D}from"./api-BVLn8tyR.js";import{S as T}from"./SearchContext-XeCDVV_F.js";import{w as k}from"./appWrappers-BwtxeNt8.js";import{SearchBar as v}from"./SearchBar-BGXnW5sm.js";import{a as b}from"./SearchResult-BewNLsYu.js";import"./preload-helper-D9Z9MdNV.js";import"./index-ufLAVrfw.js";import"./Plugin-BsRKYY6H.js";import"./componentData-mOOEbSJD.js";import"./useAnalytics-DFiGEzjB.js";import"./useApp-zMMbOjHG.js";import"./useRouteRef-CDGbELMm.js";import"./index-QN8QI6Oa.js";import"./ArrowForward-BJ4TDo_a.js";import"./translation-B0FSeRQX.js";import"./Page-DgaJmYab.js";import"./useMediaQuery-DUW0Qb7e.js";import"./Divider-CazGSVhv.js";import"./ArrowBackIos-uyJIQQwT.js";import"./ArrowForwardIos-B60LOst_.js";import"./translation-DHqHBBNA.js";import"./Modal-CXTgK8no.js";import"./Portal-CUQx1RGJ.js";import"./Backdrop-BD2Exnk-.js";import"./styled-DUE4Vhg9.js";import"./ExpandMore-4_EAOpPR.js";import"./useAsync-Cwh-MG41.js";import"./useMountedState-Ca6tx6sG.js";import"./AccordionDetails-D6NyoHkL.js";import"./index-DnL3XN75.js";import"./Collapse-C_ACyz1D.js";import"./ListItem-Cw_mLBpk.js";import"./ListContext-tHxur0ox.js";import"./ListItemIcon-Bb3cgFzX.js";import"./ListItemText-C5HwvlyG.js";import"./Tabs-DRYlupLa.js";import"./KeyboardArrowRight-Bxr5Qayr.js";import"./FormLabel-DJfGy5-g.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-pHazLfiJ.js";import"./InputLabel-CfZf9ib8.js";import"./Select-Dnd02ZUn.js";import"./Popover-ivVHntkx.js";import"./MenuItem-Bl5E30O_.js";import"./Checkbox-D1ThV9W_.js";import"./SwitchBase-BfRp0aCG.js";import"./Chip-CpxzClO1.js";import"./Link-BzX_mGVi.js";import"./lodash-CwBbdt2Q.js";import"./useObservable-BBC86g22.js";import"./useIsomorphicLayoutEffect-DkTgiNn7.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./Search-BqaBc8mn.js";import"./useDebounce-C5ZkfM-D.js";import"./InputAdornment-DcNAYbUY.js";import"./TextField-DDqcvLci.js";import"./useElementFilter-BbfzPjQA.js";import"./EmptyState-Dv8Hfkoe.js";import"./Progress-BKqaWCCo.js";import"./LinearProgress-cGsSepMI.js";import"./ResponseErrorPanel-DKb4HdKE.js";import"./ErrorPanel-B2YZjnJe.js";import"./WarningPanel-D7uKb3M5.js";import"./MarkdownContent-B1fiby4H.js";import"./CodeSnippet-CvU93WqX.js";import"./CopyTextButton-BAX6zuMk.js";import"./useCopyToClipboard-LvANOgWh.js";import"./Tooltip-Ty7zpOlh.js";import"./Popper-DhZ8DQVo.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},ao={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
