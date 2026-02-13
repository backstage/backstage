import{j as t,W as u,K as p,X as g}from"./iframe-DBsVXRYe.js";import{r as h}from"./plugin-DCeNnPG0.js";import{S as l,u as c,a as x}from"./useSearchModal-BQrQMjzu.js";import{s as S,M}from"./api-DsxXV-qP.js";import{S as C}from"./SearchContext-Bmxfx14E.js";import{B as m}from"./Button-BsyXmJi_.js";import{m as f}from"./makeStyles-u8aTytdp.js";import{D as j,a as y,b as B}from"./DialogTitle-B0gHk9e8.js";import{B as D}from"./Box-DM8WpBiE.js";import{S as n}from"./Grid-BdpucV2E.js";import{S as I}from"./SearchType-DP9RJ60w.js";import{L as G}from"./List-CIVoJXzy.js";import{H as R}from"./DefaultResultListItem-BAia07Zr.js";import{w as k}from"./appWrappers-BUXBBC5Q.js";import{SearchBar as v}from"./SearchBar-Ce0rat1V.js";import{S as T}from"./SearchResult-oRyFiZb0.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CHz7qmYH.js";import"./Plugin-D4qSg-rO.js";import"./componentData-RV0R8UNd.js";import"./useAnalytics-BiDIJzMW.js";import"./useApp-C-E0MuMI.js";import"./useRouteRef-BLhesRZS.js";import"./index-D7OOdF3Y.js";import"./ArrowForward-DDWQDVZi.js";import"./translation-DCN-qCzN.js";import"./Page-BmMN-taQ.js";import"./useMediaQuery-y5P85psE.js";import"./Divider-DEXssYkW.js";import"./ArrowBackIos--9kl3xsR.js";import"./ArrowForwardIos-C5IFqTqw.js";import"./translation-CFA9JnOO.js";import"./lodash-DArDi9rF.js";import"./useAsync-CBnGfjig.js";import"./useMountedState-D8yjF72b.js";import"./Modal-Ds3oc-YR.js";import"./Portal-9OHpjUEk.js";import"./Backdrop-DJPRpi6t.js";import"./styled-CtO3CIMm.js";import"./ExpandMore-X1Sw9hIC.js";import"./AccordionDetails-NV6-MnS3.js";import"./index-B9sM2jn7.js";import"./Collapse-DWkyhCos.js";import"./ListItem-DQ9bn4c-.js";import"./ListContext-DUSKHWgB.js";import"./ListItemIcon-DrBKcuO8.js";import"./ListItemText-Udvvf9eP.js";import"./Tabs-BH8rs-Pq.js";import"./KeyboardArrowRight-CSkWkiyd.js";import"./FormLabel-BDMi2SjX.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-uih_F7xd.js";import"./InputLabel-DyH2lMcA.js";import"./Select-yW0Lhu1K.js";import"./Popover-CizZCG4E.js";import"./MenuItem-CaWLJ_Iy.js";import"./Checkbox-DcJ65tI_.js";import"./SwitchBase-DUYfRYuV.js";import"./Chip-BhYQb-0b.js";import"./Link-B1_ZHna1.js";import"./index-CEKR_-jD.js";import"./useObservable-Cw-NZLrh.js";import"./useIsomorphicLayoutEffect-Cvl6J7vf.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-e6ak7MjC.js";import"./useDebounce-B_Wbv9-O.js";import"./InputAdornment-DO2bH2vO.js";import"./TextField-DMy5iAVs.js";import"./useElementFilter-E4iLmPhR.js";import"./EmptyState--C_FMS10.js";import"./Progress-_2JDCkpS.js";import"./LinearProgress-qgSCem3d.js";import"./ResponseErrorPanel-BM0_isYV.js";import"./ErrorPanel-C_2-4xfK.js";import"./WarningPanel-DTJyTb6A.js";import"./MarkdownContent-B-wQhPbk.js";import"./CodeSnippet-f1HNpjZM.js";import"./CopyTextButton-DnqYIBWb.js";import"./useCopyToClipboard-CW8p6N-z.js";import"./Tooltip-CPJgV8tS.js";import"./Popper-BrV3NxJy.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
  const { state, toggleModal } = useSearchModal();

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>
  );
};
`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const CustomModal = () => {
  const classes = useStyles();
  const { state, toggleModal } = useSearchModal();

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => (
          <>
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
                  <SearchType.Tabs
                    defaultValue=""
                    types={[
                      {
                        value: "custom-result-item",
                        name: "Custom Item",
                      },
                      {
                        value: "no-custom-result-item",
                        name: "No Custom Item",
                      },
                    ]}
                  />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({ results }) => (
                      <List>
                        {results.map(({ document }) => (
                          <div
                            role="button"
                            tabIndex={0}
                            key={\`\${document.location}-btn\`}
                            onClick={toggleModal}
                            onKeyPress={toggleModal}
                          >
                            <DefaultResultListItem
                              key={document.location}
                              result={document}
                            />
                          </div>
                        ))}
                      </List>
                    )}
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
          </>
        )}
      </SearchModal>
    </>
  );
};
`,...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const co=["Default","CustomModal"];export{r as CustomModal,e as Default,co as __namedExportsOrder,lo as default};
